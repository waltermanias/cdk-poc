import * as cdk from '@aws-cdk/core'
import { RestApi, EndpointType, MockIntegration, LambdaIntegration } from '@aws-cdk/aws-apigateway'
import { LambdaBuilder } from './lambda-builder'
export class ApiGatewayBuilder {
  constructor(private scope: cdk.Construct, private props?: cdk.StackProps) {}

  build(): RestApi {
    // 1. Define the resource.
    const api = new RestApi(this.scope, 'APIGateway', {
      restApiName: 'API Gateway - Call External API',
      description: 'RESTful API',
      endpointTypes: [EndpointType.REGIONAL],
      deployOptions: {
        stageName: 'prod',
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
    rootResource.addMethod(
      'POST',
      new LambdaIntegration(lambda, {
        proxy: true,
      })
    )
  }
}
