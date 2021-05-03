import fastifyStatic from 'fastify-static';

import path from 'path';

import config from '../config';

import type { FastifyPluginCallback } from 'fastify';

const WEB_ROOT: string = path.join(__dirname, '..', config.rootDirectory);

const callback: FastifyPluginCallback = async (server, options) => {
  server.register(fastifyStatic, {
    root: WEB_ROOT,
    etag: false
 });
  server.setNotFoundHandler((request, reply) => {
    reply.statusCode = 404;
    reply.header('Content-Type', 'text/html; charset=UTF-8');
    reply.sendFile(config.errorPage);
  });
};

export default callback;
