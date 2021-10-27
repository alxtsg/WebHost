import healthAPI from '../apis/health-api.js';

import type { FastifyPluginCallback } from 'fastify';

const callback: FastifyPluginCallback = async (server, options) => {
  server.register(healthAPI);
};

export default callback;
