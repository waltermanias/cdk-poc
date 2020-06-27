export const config = {
  accountId: '183327011294',
  region: 'us-west-1', // Default region
  restApiName: 'API Gateway - Call External API',
  restApiDescription: '',
  restApiStageName: 'prod',
  bucketName: 'breached-mail-account-reports',
  apiEndpoint: 'https://aa3ivofyag.execute-api.us-west-1.amazonaws.com/prod/api/v3/breachedaccount', // Without the last slash
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
