import APIError from '../errors/api-error.js';
import dummyAPI from '../apis/dummy-api.js';
import ErrorCode from '../errors/error-code.js';
import healthAPI from '../apis/health-api.js';

import type { FastifyPluginCallback } from 'fastify';

const isAPIError = (error: Error): error is APIError => {
  return (error instanceof APIError);
};

const callback: FastifyPluginCallback = async (server, options) => {
  server.register(dummyAPI);
  server.register(healthAPI);

  server.setNotFoundHandler((request, reply) => {
    reply.status(404)
      .send({
        code: ErrorCode.NotFound,
        message: 'Invalid API path.'
      });
    return;
  });

  server.setErrorHandler((error, request, reply) => {
    if (!isAPIError(error)) {
      reply.status(500)
        .send({
          code: ErrorCode.InternalServerError,
          message: 'Internal server error.'
        });
      return;
    }
    reply.status(error.statusCode)
      .send({
        code: error.code,
        message: error.message
      });
  });
};

export default callback;
