import * as cdk from '@aws-cdk/core'
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda'
import { Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam'
import * as path from 'path'

export class LambdaBuilder {
  constructor(private scope: cdk.Construct, private props?: cdk.StackProps) {}

  build(): Function {
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
        managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaRole')],
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      }),
    })
    return lambda
  }
}
