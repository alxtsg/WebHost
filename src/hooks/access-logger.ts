import pino from 'pino';

import path from 'path';
import url from 'url';

import config from '../config.js';

import type { onRequestAsyncHookHandler } from 'fastify';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
