#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { ExternalApiCallStack } from '../lib/external-api-call-stack'

const app = new cdk.App()
new ExternalApiCallStack(app, 'ExternalApiCallStack')
