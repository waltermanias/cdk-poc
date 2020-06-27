import * as path from 'path'

import * as cdk from '@aws-cdk/core'
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda'
import { Role, ServicePrincipal, ManagedPolicy, PolicyDocument, PolicyStatement, Effect } from '@aws-cdk/aws-iam'

import { config } from '../project.config'

export class LambdaBuilder {
  constructor(private scope: cdk.Construct, private props?: cdk.StackProps) {}

  build(): Function {
    const lambda = new Function(this.scope, 'Lambda', {
      functionName: 'VerifyBreachedMailAccountFunction',
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, '../lambdas/create-request')),
      environment: {
        API_KEY: config.apiKey,
        TABLE_NAME: config.DynamoDB.tableName,
      },
      role: new Role(this.scope, 'LambdaRole', {
        roleName: 'VerifyBreachedMailAccountRole',
        path: '/',
        managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        inlinePolicies: {
          DynamoDBPermissions: new PolicyDocument({
            statements: [
              new PolicyStatement({
                actions: ['dynamodb:PutItem'],
                effect: Effect.ALLOW,
                resources: [
                  `arn:aws:dynamodb:${config.DynamoDB.region || config.region}:${config.accountId}:table/${
                    config.DynamoDB.tableName
                  }`,
                ],
              }),
            ],
          }),
        },
      }),
      timeout: cdk.Duration.seconds(10),
    })
    return lambda
  }
}
