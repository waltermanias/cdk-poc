export const config = {
  accountId: '999999999999',
  region: 'us-west-1', // Default region
  restApiName: 'API Gateway - Call External API',
  restApiDescription: '',
  restApiStageName: 'prod',
  bucketName: 'bucket-name',
  apiEndpoint: 'https://example.com/api/v3/breachedaccount', // Without the last slash
  apiKey: 'XXXXXXXXXXXXXXXXXXXXXX',
  SES: {
    to: 'example@company.com',
    region: 'us-west-2', // Overrides the custom region
    from: 'example@company.com',
  },
  DynamoDB: {
    tableName: 'Requests',
    region: 'us-west-1', // Overrides the custom region
  },
  cloudFormation: {
    accessKeyID: 'XXXXXXXXXXXXXXXXXXXX',
    privateKey: '-----BEGIN RSA PRIVATE KEY-----\nXXXXXXXXXXX\n-----END RSA PRIVATE KEY-----',
  },
}
