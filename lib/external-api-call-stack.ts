import * as cdk from '@aws-cdk/core'

import { ApiGatewayBuilder } from './builders/api-gateway-builder'
import { S3BucketBuilder } from './builders/s3-bucket-builder'

export class ExternalApiCallStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // 1. Build the API Gateway definition.
    new ApiGatewayBuilder(this, props).build()

    // 2. Build S3 Bucket
    new S3BucketBuilder(this, props).build()
  }
}
