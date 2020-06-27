import * as path from 'path'

import * as cdk from '@aws-cdk/core'
import { Table, AttributeType, StreamViewType } from '@aws-cdk/aws-dynamodb'
import { DynamoEventSource } from '@aws-cdk/aws-lambda-event-sources'
import { Function, Runtime, Code, LayerVersion, StartingPosition } from '@aws-cdk/aws-lambda'
import { Role, ServicePrincipal, ManagedPolicy, PolicyDocument, PolicyStatement, Effect } from '@aws-cdk/aws-iam'

import { config } from '../project.config'
import { Duration } from '@aws-cdk/core'

export class DynamoDBBuilder {
  constructor(private scope: cdk.Construct, private props?: cdk.StackProps) {}

  build(): Table {
    const dbTable = new Table(this.scope, 'DynamoDBTable', {
      tableName: config.DynamoDB.tableName,
      partitionKey: {
        name: 'Id',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'Timestamp',
        type: AttributeType.NUMBER,
      },
      stream: StreamViewType.NEW_IMAGE,
    })

    // this.onCreateStreamProcessingFunction(dbTable)

    return dbTable
  }

  private onCreateStreamProcessingFunction(table: Table): Function {
    const layer = new LayerVersion(this.scope, 'HTMLToPDFLambdaLayer', {
      code: Code.fromAsset(path.join(__dirname, '../lambda-layer')),
      description: 'Layer to support pdf converter.',
      layerVersionName: 'HTMLToPDFLambdaLayer',
    })

    const lambda = new Function(this.scope, 'StreamProcessorLambda', {
      functionName: 'GenerateReportForBreachedMailAccountFunction',
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, '../lambda/stream-processor')),
      environment: {
        BUCKET_NAME: config.bucketName,
        EMAIL_TO: config.SES.to,
        EMAIL_FROM: config.SES.from,
        SES_REGION: config.SES.region || config.region,
      },
      role: new Role(this.scope, 'StreamProcessorLambdaRole', {
        roleName: 'GenerateReportForBreachedMailAccountRole',
        path: '/',
        managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        inlinePolicies: {
          S3Permissions: new PolicyDocument({
            statements: [
              new PolicyStatement({
                actions: ['s3:PutObject'],
                effect: Effect.ALLOW,
                resources: [`arn:aws:s3:::${config.bucketName}/*`],
              }),
            ],
          }),
          SESPermissions: new PolicyDocument({
            statements: [
              new PolicyStatement({
                actions: ['ses:SendEmail'],
                effect: Effect.ALLOW,
                resources: ['*'],
              }),
            ],
          }),
        },
      }),
      timeout: cdk.Duration.seconds(15),
      layers: [layer],
    })

    // Add trigger
    lambda.addEventSource(
      new DynamoEventSource(table, {
        startingPosition: StartingPosition.LATEST,
        batchSize: 5,
        bisectBatchOnError: true,
        maxBatchingWindow: Duration.seconds(10),
        retryAttempts: 5,
      })
    )

    return lambda
  }
}
