import fetch from 'node-fetch';

import assert from 'assert';

import * as common from './common';

const BASE_URL: string = `${common.BASE_URL}/health`;

describe('Health API', async () => {
  it('can get health status', async () => {
    await assert.doesNotReject(async () => {
      const response = await fetch(BASE_URL);
      assert.strictEqual(response.ok, true);
    });
  });
});
