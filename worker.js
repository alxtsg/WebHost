/**
 * Web server worker.
 *
 * @author Alex TSANG <alextsang@live.com>
 *
 * @license BSD-3-Clause
 */

'use strict';

const express = require('express');

const accessLogger = require('./middlewares/access-logger.js');
const http404Handler = require('./middlewares/http-404-handler.js');
const MessageType = require('./message-type.js');

/**
 * Handles the message sent from the master.
 *
 * @param {object} message Message object sent from the master.
 */
const handleMasterMessage = (message) => {
  switch (message.type) {
    case MessageType.START_SERVER:
      startServer(message.config);
      break;
    default:
      console.error(`Unrecognized message type: ${message.type}`);
  }
};

/**
 * Starts server.
 */
const startServer = (config) => {
  const expressApp = new express();
  // Disable several response headers.
  expressApp.disable('etag');
  expressApp.disable('x-powered-by');
  // WebHost is expected to run behind a reverse proxy.
  expressApp.set('trust proxy', true);
  // Log incoming requests.
  expressApp.use(accessLogger.getMiddleware());
  // Serve static files by express-static.
  expressApp.use(express.static(
    config.rootDirectory,
    {
      etag: false
    }
  ));
  // HTTP 404 handler.
  expressApp.use(http404Handler.getMiddleware());
  // Create HTTP server.
  try {
    expressApp.listen(config.port);
    console.log(`${(new Date()).toISOString()} Started HTTP server.`);
  } catch (error) {
    console.error(`Unable to start HTTP server: ${error.message}`);
  }
};

/**
 * Initializes worker.
 */
const init = () => {
  process.on('message', (message) => {
    handleMasterMessage(message);
  });
};

module.exports = {
  init
};
