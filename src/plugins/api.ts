import healthAPI from '../apis/health-api';

import type { FastifyPluginCallback } from 'fastify';

const callback: FastifyPluginCallback = (server, options, done) => {
  server.register(healthAPI);
  server.setNotFoundHandler(async (request, reply) => {
    reply.statusCode = 404;
    return {
      message: 'Resource not found.'
    }
  });
  done();
};

export default callback;
