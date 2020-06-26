import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ExternalApiCall from '../lib/external-api-call-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ExternalApiCall.ExternalApiCallStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
