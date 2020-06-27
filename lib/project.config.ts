export const config = {
  restApiName: 'API Gateway - Call External API',
  restApiDescription: '',
  restApiStageName: 'prod',
  bucketName: 'breached-mail-account-reports',
  apiKey: 'XXXXXXXXXXXXXXXXXXXXXX',
  SES: {
    to: 'wmanias@gmail.com',
    region: 'us-west-2',
    from: 'wmanias@gmail.com',
  },
}
