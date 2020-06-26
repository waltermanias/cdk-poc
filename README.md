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

## First steps

To deploy the project, you must run the next commands.

- `npm install` install all dependencies
- The Lambda function has to be deployed with `node_modules` folder. Open a terminal and navigate to the next folder `/lib/lambda` and run `npm install`.

## Deploy resources to AWS

The deploy process is very streightforward. Just run the next command:

1.  Open a terminal and navigate to the project root.
2.  Execute `cdk deploy`.
3.  You will have to confirm the resources that you're going to deploy, specially related to the security.
4.  If you go to AWS Console and open CloudFormation service, you'll find there the template.

## Troubleshotting

- The code doesn't work. If you run all mentioned steps, check the next common issue.
  - Run in the terminal the next command `cdk --version`.
  - Ensure that all dependant packages have the same version. You can check it into the `package.json` file at the root of the project.
  - For example, currently, the CDK's version I have is **1.47.0**. And if I check in the package.json the AWS dependendies (always starts with @aws-cdk/package-name) all of them have the same version ("@aws-cdk/aws-apigateway": **"1.47.0"**, "@aws-cdk/aws-iam": **"1.47.0"**).

## CDK Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
