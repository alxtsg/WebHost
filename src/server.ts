import fastify from 'fastify';

import fs from 'fs';
import path from 'path';

import config from './config';

import requestLogger from './hooks/access-logger'

import apiPlugin from './plugins/api';
import webPlugin from './plugins/web'

import type { FastifyInstance } from 'fastify';

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
    await server.listen(config.port);
    await writePidFile();
  } catch (error) {
    console.error('Error occurred when starting server.');
    console.error(error);
    process.exit(ERROR_EXIT_CODE);
  }
};

start();

export default server;
