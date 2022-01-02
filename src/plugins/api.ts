import APIError from '../errors/api-error.js';
import dummyAPI from '../apis/dummy-api.js';
import healthAPI from '../apis/health-api.js';

import type { FastifyPluginCallback } from 'fastify';

const callback: FastifyPluginCallback = async (server, options) => {
  server.register(dummyAPI);
  server.register(healthAPI);

  server.setErrorHandler((error, request, reply) => {
    if (!(error instanceof APIError)) {
      reply.status(500)
        .send({
          status: 'fail',
          message: 'Internal server error.'
        });
      return;
    }
    reply.status(error.statusCode)
      .send({
        status: 'fail',
        message: error.message
      });
  });
};

export default callback;
