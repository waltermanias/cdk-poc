import * as cdk from '@aws-cdk/core'
import {
  CloudFrontWebDistribution,
  ViewerProtocolPolicy,
  HttpVersion,
  OriginAccessIdentity,
} from '@aws-cdk/aws-cloudfront'
import { IBucket } from '@aws-cdk/aws-s3'

export class CloudfrontBuilder {
  constructor(private scope: cdk.Construct, private props?: cdk.StackProps) {}

  build(bucket: IBucket): CloudFrontWebDistribution {
    return new CloudFrontWebDistribution(this.scope, 'S3Cloudfront', {
      comment: 'Cloudfront distribution to expose files without expiration time.',
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: new OriginAccessIdentity(this.scope, 'OAI', {
              comment: 'access-identity-breached-email-accounts',
            }),
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      httpVersion: HttpVersion.HTTP2,
    })
  }
}
