import { FastifyPluginCallback } from 'fastify';

import DummyError from '../errors/dummy-error.js';

const BASE_PATH: string = '/dummies'

const callback: FastifyPluginCallback = (server, options, done) => {
  server.get(BASE_PATH, async (request, reply) => {
    throw new DummyError('Dummy error.');
  });
  done();
};

export default callback;
