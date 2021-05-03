import pino from 'pino';

import path from 'path';

import config from '../config';

import type { onRequestAsyncHookHandler } from 'fastify';

const logger = pino(pino.destination({
  dest: path.join(__dirname, '..', config.accessLog)
}));

const handler: onRequestAsyncHookHandler = async (request) => {
  const entry = {
    timestamp: (new Date()).toISOString(),
    ip: request.ip,
    method: request.method,
    url: request.url
  };
  logger.info(entry);
};

export default handler;
