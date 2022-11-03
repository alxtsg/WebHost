import fetch from 'node-fetch';

import assert from 'assert';

import * as common from '../common.js';
import ErrorCode from '../../errors/error-code.js';

const BASE_URL = `${common.BASE_URL}/api/dummies`;

describe('Dummy API', async () => {
  it('the API is a teapot', async () => {
    await assert.doesNotReject(async () => {
      const response = await fetch(BASE_URL);
      assert.strictEqual(response.status, 418);
      const json = await response.json();
      if (!common.isErrorResponse(json)) {
        throw new Error('Unexpected response body form.');
      }
      assert.strictEqual(json.code, ErrorCode.DummyError);
    });
  });
});
