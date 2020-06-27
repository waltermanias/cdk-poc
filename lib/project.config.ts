export const config = {
  accountId: '183327011294',
  region: 'us-west-1', // Default region
  restApiName: 'API Gateway - Call External API',
  restApiDescription: '',
  restApiStageName: 'prod',
  bucketName: 'breached-mail-account-reports',
  apiKey: 'XXXXXXXXXXXXXXXXXXXXXX',
  SES: {
    to: 'wmanias@gmail.com',
    region: 'us-west-2', // Overrides the custom region
    from: 'wmanias@gmail.com',
  },
  DynamoDB: {
    tableName: 'Requests',
    region: 'us-west-1', // Overrides the custom region
  },
}
