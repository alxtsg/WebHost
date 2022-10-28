import assert from 'assert';
import path from 'path';

import config from '../config.js';

const ROOT_DIRECTORY = 'web';
const PORT = 8080;
const ERROR_PAGE = '404.html';
const ACCESS_LOG = path.join('logs', 'access.log');

describe('Configurations module', async () => {
  it('can load configurations', async () => {
    assert.strictEqual(config.rootDirectory, ROOT_DIRECTORY);
    assert.strictEqual(config.port, PORT);
    assert.strictEqual(config.errorPage, ERROR_PAGE);
    assert.strictEqual(config.accessLog, ACCESS_LOG);
  });
});
