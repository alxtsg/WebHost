import assert from 'assert';
import path from 'path';

import config from '../config';

const ROOT_DIRECTORY: string = 'web';
const PORT: number = 8080;
const ERROR_PAGE: string = '404.html';
const ACCESS_LOG: string = path.join('logs', 'access.log');

describe('Configurations module', async (): Promise<void> => {
  it('can load configurations', async (): Promise<void> => {
    assert.strictEqual(config.rootDirectory, ROOT_DIRECTORY);
    assert.strictEqual(config.port, PORT);
    assert.strictEqual(config.errorPage, ERROR_PAGE);
    assert.strictEqual(config.accessLog, ACCESS_LOG);
  });
});
