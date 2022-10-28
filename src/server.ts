import fastify from 'fastify';

import fsPromises from 'fs/promises';
import path from 'path';
import url from 'url';

import config from './config.js';

import requestLogger from './hooks/access-logger.js';

import apiPlugin from './plugins/api.js';
import webPlugin from './plugins/web.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ERROR_EXIT_CODE = 1;
const PID_FILE = path.join(__dirname, 'webhost.pid');

const server = fastify();

server.register(apiPlugin, { prefix: '/api' });
server.register(webPlugin);

server.addHook('onRequest', requestLogger);

const writePidFile = async () => {
  const content = `${process.pid}`;
  await fsPromises.writeFile(PID_FILE, content);
};

const start = async () => {
  try {
    await server.listen({port: config.port});
    await writePidFile();
  } catch (error) {
    console.error('Error occurred when starting server.');
    console.error(error);
    process.exit(ERROR_EXIT_CODE);
  }
};

start();

export default server;
