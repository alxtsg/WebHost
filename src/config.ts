import dotenv from 'dotenv';

import path from 'path';
import url from 'url';

import type AppConfig from './types/app-config.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_FILE: string = path.join(__dirname, '.env');

const config: AppConfig = {
  rootDirectory: '',
  port: 0,
  errorPage: '',
  accessLog: ''
};

const isValidPortRange = (port: number) => ((port > 0) && (port <= 65535));

const loadConfig = (): void => {
  const result = dotenv.config({
    path: ENV_FILE
  });
  if (result.error !== undefined) {
    throw new Error(`Unable to read .env: ${result.error.message}`);
  }
  if (result.parsed === undefined) {
    throw new Error('No parsed configurations.');
  }
  const envConfig = result.parsed;
  config.rootDirectory = envConfig.ROOT_DIRECTORY;
  let portNumber: number = Number(envConfig.PORT);
  if (!Number.isInteger(portNumber) ||
    !isValidPortRange(portNumber)) {
    throw new Error('Invalid port number.');
  }
  config.port = portNumber;
  config.errorPage = envConfig.ERROR_PAGE;
  config.accessLog = envConfig.ACCESS_LOG;
};

loadConfig();

export default config;
