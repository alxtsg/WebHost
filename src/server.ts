import fastify from 'fastify';

import config from './config.js';

import requestLogger from './hooks/access-logger.js';

import apiPlugin from './plugins/api.js';
import webPlugin from './plugins/web.js';

const ERROR_EXIT_CODE = 1;

const server = fastify();

server.register(apiPlugin, { prefix: '/api' });
server.register(webPlugin);

server.addHook('onRequest', requestLogger);

const start = async () => {
  try {
    await server.listen({port: config.port});
  } catch (error) {
    console.error('Error occurred when starting server.');
    console.error(error);
    process.exit(ERROR_EXIT_CODE);
  }
};

start();

export default server;
