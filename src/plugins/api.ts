import healthAPI from '../apis/health-api';

import type { FastifyPluginCallback } from 'fastify';

const callback: FastifyPluginCallback = async (server, options) => {
  server.register(healthAPI);
};

export default callback;
