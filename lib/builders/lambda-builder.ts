import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import { Function, Runtime, Code, LayerVersion } from '@aws-cdk/aws-lambda'
import { Role, ServicePrincipal, ManagedPolicy, PolicyDocument, PolicyStatement, Effect } from '@aws-cdk/aws-iam'

import { config } from '../project.config'

export class LambdaBuilder {
  constructor(private scope: cdk.Construct, private props?: cdk.StackProps) {}

  build(): Function {
    const layer = new LayerVersion(this.scope, 'HTMLToPDFLambdaLayer', {
      code: Code.fromAsset(path.join(__dirname, '../lambda-layer')),
      description: 'Layer to support pdf converter.',
      layerVersionName: 'HTMLToPDFLambdaLayer',
    })

    const lambda = new Function(this.scope, 'Lambda', {
      functionName: 'VerifyBreachedMailAccountFunction',
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        API_KEY: config.apiKey,
        BUCKET_NAME: config.bucketName,
      },
      role: new Role(this.scope, 'LambdaRole', {
        roleName: 'VerifyBreachedMailAccountRole',
        path: '/',
        managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        inlinePolicies: {
          S3BucketPermission: new PolicyDocument({
            statements: [
              new PolicyStatement({
                actions: ['s3:PutObject'],
                effect: Effect.ALLOW,
                resources: [`arn:aws:s3:::${config.bucketName}/*`],
              }),
            ],
          }),
        },
      }),
      layers: [layer],
      timeout: cdk.Duration.seconds(10),
    })
    return lambda
  }
}
