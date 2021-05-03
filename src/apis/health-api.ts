import { FastifyPluginCallback } from 'fastify';

const BASE_PATH: string = '/health'

const callback: FastifyPluginCallback = (server, options, done) => {
  server.get(BASE_PATH, async (request, reply) => {
    return {
      status: 'ok'
    };
  });
  done();
};

export default callback;
