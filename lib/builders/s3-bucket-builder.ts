import * as cdk from '@aws-cdk/core'
import { Bucket } from '@aws-cdk/aws-s3'
import { config } from '../project.config'

export class S3BucketBuilder {
  constructor(private scope: cdk.Construct, private props?: cdk.StackProps) {}

  build(): Bucket {
    return new Bucket(this.scope, 's3-bucket-reports', {
      bucketName: config.bucketName,
    })
  }
}
