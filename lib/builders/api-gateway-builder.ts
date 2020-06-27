import * as cdk from '@aws-cdk/core'
import {
  RestApi,
  EndpointType,
  LambdaIntegration,
  Cors,
  Model,
  JsonSchemaType,
  RequestValidator,
} from '@aws-cdk/aws-apigateway'
import { LambdaBuilder } from './lambda-builder'

import { config } from '../project.config'

export class ApiGatewayBuilder {
  constructor(private scope: cdk.Construct, private props?: cdk.StackProps) {}

  build(): RestApi {
    // 1. Define the resource.
    const api = new RestApi(this.scope, 'APIGateway', {
      restApiName: config.restApiName,
      description: config.restApiDescription,
      endpointTypes: [EndpointType.REGIONAL],
      deployOptions: {
        stageName: config.restApiStageName,
      },
    })

    // 2. Add the different methods.
    this.createPostMethod(api)

    // 3. Return the resource
    return api
  }

  private createPostMethod(api: RestApi) {
    // 1. Create the lambda function
    const lambda = new LambdaBuilder(this.scope, this.props).build()

    // 2. Create the resource's name
    const rootResource = api.root.addResource('verify-breached-mail-account')
    rootResource.addCorsPreflight({
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: Cors.DEFAULT_HEADERS,
    })

    rootResource.addMethod(
      'POST',
      new LambdaIntegration(lambda, {
        proxy: true,
      }),
      {
        requestValidator: new RequestValidator(this.scope, 'apg-body-validator', {
          restApi: api,
          requestValidatorName: 'Validate body',
          validateRequestBody: true,
          validateRequestParameters: false,
        }),
        requestModels: {
          'application/json': new Model(this.scope, '_BreachedMailAccountRequestModel', {
            modelName: 'BreachedMailAccountRequestModel',
            contentType: 'application/json',
            restApi: api,
            schema: {
              type: JsonSchemaType.OBJECT,
              properties: {
                email: {
                  type: JsonSchemaType.STRING,
                },
                name: {
                  type: JsonSchemaType.STRING,
                },
              },
              required: ['email', 'name'],
            },
          }),
        },
      }
    )
  }
}
