/**
 * Configuration module.
 *
 * @author Alex TSANG <alextsang@live.com>
 *
 * @license BSD-3-Clause
 */

const dotenv = require('dotenv');

const path = require('path');

/**
 * .env file path.
 */
const envFile = path.join(__dirname, '.env');

/**
 * PID file path.
 */
const pidFile = path.join(__dirname, 'webhost.pid');

const config = {
  rootDirectory: null,
  errorPage: null,
  accessLog: null,
  port: null,
  pidFile
};

const radix = 10;

/**
 * Gets absolute path.
 *
 * @param {string} filePath Path.
 *
 * @returns {string} If the path is an absolute path, the path will be returned.
 *                   If the specified path is not an absolute path, the absolute
 *                   path relative to the installation directory will be
 *                   returned.
 */
const getAbsolutePath = (filePath) => {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  return path.join(__dirname, filePath);
};

const result = dotenv.config({
  path: envFile
});
if (result.error !== undefined) {
  throw new Error(`Unable to read .env: ${result.error.message}`);
}
const envConfig = result.parsed;
config.rootDirectory = getAbsolutePath(envConfig.ROOT_DIRECTORY);
config.errorPage = getAbsolutePath(envConfig.ERROR_PAGE);
config.accessLog = getAbsolutePath(envConfig.ACCESS_LOG);
config.port = parseInt(envConfig.PORT, radix);

module.exports = config;
