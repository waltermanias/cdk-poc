
# Welcome to External API Call project!

This is a project that generate a **CloudFormation** template and deploy it using **AWS CDK** (AWS Cloud Development Kit)

Let's start to configure your environment!

## Prerequisites

To work with AWS CDK, you must have an AWS account and credentials and have installed Node.js (v10.3 or later) and the AWS CDK Toolkit.

If you already have Node.js, installl the AWS CDK Toolkit:

    npm install -g aws-cdk  

Test the installation by issuing `cdk --version`.

You also need TypeScript itself. If you don't already have it, you can install it using `npm`.

    npm install -g typescript

Check if you have the AWS CLI installed and configured.

#### Tip
If you have the [AWS CLI](https://aws.amazon.com/cli/) installed, the simplest way to set up your workstation with your AWS credentials is to open a command prompt and type:

    aws configure

## CDK Useful commands
*  `npm run build` compile typescript to js
*  `npm run watch` watch for changes and compile
*  `npm run test` perform the jest unit tests
*  `cdk deploy` deploy this stack to your default AWS account/region
*  `cdk diff` compare deployed stack with current state
*  `cdk synth` emits the synthesized CloudFormation template