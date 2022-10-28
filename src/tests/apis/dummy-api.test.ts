import fetch from 'node-fetch';

import assert from 'assert';

import * as common from '../common.js';

const BASE_URL = `${common.BASE_URL}/api/dummies`;

describe('Dummy API', async () => {
  it('the API is a teapot', async () => {
    await assert.doesNotReject(async () => {
      const response = await fetch(BASE_URL);
      assert.strictEqual(response.status, 418);
    });
  });
});
