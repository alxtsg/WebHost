import fastify from 'fastify';

import fs from 'fs';
import path from 'path';
import url from 'url';

import config from './config.js';

import requestLogger from './hooks/access-logger.js'

import apiPlugin from './plugins/api.js';
import webPlugin from './plugins/web.js'

import type { FastifyInstance } from 'fastify';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ERROR_EXIT_CODE: number = 1;
const PID_FILE: string = path.join(__dirname, 'webhost.pid');

const fsPromises = fs.promises;

const server: FastifyInstance = fastify();

server.register(apiPlugin, { prefix: '/api' });
server.register(webPlugin);

server.addHook('onRequest', requestLogger);

const writePidFile = async () => {
  const content: string = `${process.pid}`;
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
