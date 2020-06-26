import * as cdk from '@aws-cdk/core'
import { Function, Runtime, Code, LayerVersion } from '@aws-cdk/aws-lambda'
import { Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam'
import * as path from 'path'

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
        API_KEY: 'SomeAPIKey',
      },
      role: new Role(this.scope, 'LambdaRole', {
        roleName: 'VerifyBreachedMailAccountRole',
        path: '/',
        managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      }),
      layers: [layer],
      timeout: cdk.Duration.seconds(10),
    })
    return lambda
  }
}
