#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkSelfStudyStack } from '../lib/cdk-self-study-stack';

const app = new cdk.App();
new CdkSelfStudyStack(app, 'CdkSelfStudyStack', {
  env: {  
    account: process.env.ACCOUNT_ID,
    region: 'ap-southeast-2'
  }
});