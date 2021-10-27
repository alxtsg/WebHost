import fetch from 'node-fetch';

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import url from 'url';

import * as common from './common.js';
import config from '../config.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEB_ROOT: string = path.join(__dirname, '..', config.rootDirectory);
const NOT_FOUND_PAGE: string = path.join(WEB_ROOT, '404.html');

const fsPrommises = fs.promises;

describe('Web server', async () => {
  it('can serve static files', async () => {
    await assert.doesNotReject(async () => {
      const response = await fetch(common.BASE_URL);
      assert.strictEqual(response.ok, true);
    });
  });

  it('can serve customized 404 page', async () => {
    const notFoundPage: string = await fsPrommises.readFile(
      NOT_FOUND_PAGE,
      {
        encoding: 'utf8'
      }
    );
    await assert.doesNotReject(async () => {
      const url: string = `${common.BASE_URL}/does-not-exist`;
      const response = await fetch(url);
      assert.strictEqual(response.ok, false);
      const responseBody: string = await response.text();
      assert.strictEqual(responseBody, notFoundPage);
    });
  });
});
