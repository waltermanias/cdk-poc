import * as cdk from '@aws-cdk/core'

import { ApiGatewayBuilder } from './builders/api-gateway-builder'
import { S3BucketBuilder } from './builders/s3-bucket-builder'
import { DynamoDBBuilder } from './builders/dynamodb-builder'
import { CloudfrontBuilder } from './builders/cloudfront-builder'

export class ExternalApiCallStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // 1. Build the API Gateway definition.
    new ApiGatewayBuilder(this, props).build()

    // 2. Build S3 Bucket
    const bucket = new S3BucketBuilder(this, props).build()

    // 3. Build Cloudfront Distribution
    const cfDistribution = new CloudfrontBuilder(this, props).build(bucket)

    // 4. Build DynamoDB table
    new DynamoDBBuilder(this, props).build(cfDistribution.domainName)
  }
}
