import fastify from 'fastify';

import config from './config';

import requestLogger from './hooks/access-logger'

import healthAPIRouter from './apis/health-api';

import type { FastifyInstance } from 'fastify';

const ERROR_EXIT_CODE: number = 1;

const server: FastifyInstance = fastify();

server.register(healthAPIRouter);

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
