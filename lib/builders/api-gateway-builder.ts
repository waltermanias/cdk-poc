import * as cdk from '@aws-cdk/core'
import { RestApi, EndpointType, MockIntegration } from '@aws-cdk/aws-apigateway'
export class ApiGatewayBuilder {
  constructor(private scope: cdk.Construct, private props?: cdk.StackProps) {}

  build(): RestApi {
    const api = new RestApi(this.scope, 'APIGateway', {
      restApiName: 'API Gateway - Call External API',
      description: 'RESTful API',
      endpointTypes: [EndpointType.REGIONAL],
      deployOptions: {
        stageName: 'prod',
      },
    })
    const v1Resource = api.root.addResource('test')
    v1Resource.addMethod('POST', new MockIntegration({}))
    return api
  }
}
