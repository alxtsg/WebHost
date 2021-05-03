import fastify from 'fastify';

import config from './config';

import requestLogger from './hooks/access-logger'

import apiPlugin from './plugins/api';
import webPlugin from './plugins/web'

import type { FastifyInstance } from 'fastify';

const ERROR_EXIT_CODE: number = 1;

const server: FastifyInstance = fastify();

server.register(apiPlugin, { prefix: '/api' });
server.register(webPlugin);

server.addHook('onRequest', requestLogger);

server.listen(config.port, (error: Error): void => {
  if (error !== null) {
    console.error('Unable to start server.');
    console.error(error);
    process.exit(ERROR_EXIT_CODE);
  }
  server.log.info(`Started server, listening on port ${config.port}.`);
});

export default server;
