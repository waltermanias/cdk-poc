import * as cdk from '@aws-cdk/core'
import { RestApi, EndpointType } from '@aws-cdk/aws-apigateway'
import { ApiGatewayBuilder } from './builders/api-gateway-builder'

export class ExternalApiCallStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // 1. Build the API Gateway definition.
    const builder = new ApiGatewayBuilder(this, props)
    builder.build()
  }
}
