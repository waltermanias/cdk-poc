import * as cdk from '@aws-cdk/core'
import { Bucket, HttpMethods, EventType } from '@aws-cdk/aws-s3'

export class S3BucketBuilder {
  constructor(private scope: cdk.Construct, private props?: cdk.StackProps) {}

  build(): Bucket {
    return new Bucket(this.scope, 's3-bucket-reports', {
      bucketName: 'breached-mail-account-reports',
    })
  }
}
