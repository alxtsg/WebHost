import fetch from 'node-fetch';

import assert from 'assert';
import fsPromises from 'fs/promises';
import path from 'path';
import url from 'url';

import * as common from './common.js';
import config from '../config.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEB_ROOT = path.join(__dirname, '..', config.rootDirectory);
const NOT_FOUND_PAGE = path.join(WEB_ROOT, '404.html');

describe('Web server', async () => {
  it('can serve static files', async () => {
    await assert.doesNotReject(async () => {
      const response = await fetch(common.BASE_URL);
      assert.strictEqual(response.ok, true);
    });
  });

  it('can serve customized 404 page', async () => {
    const notFoundPage = await fsPromises.readFile(
      NOT_FOUND_PAGE,
      {
        encoding: 'utf8'
      }
    );
    await assert.doesNotReject(async () => {
      const url = `${common.BASE_URL}/does-not-exist`;
      const response = await fetch(url);
      assert.strictEqual(response.ok, false);
      const responseBody = await response.text();
      assert.strictEqual(responseBody, notFoundPage);
    });
  });
});
