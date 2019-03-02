/**
 * Web server worker.
 *
 * @author Alex Tsang <alextsang@live.com>
 *
 * @license BSD-3-Clause
 */

'use strict';

const fs = require('fs');
const path = require('path');

const express = require('express');

const Logger = require(path.join(
  __dirname,
  'logger.js'
));
const MessageType = require(path.join(
  __dirname,
  'message-type.js'
));

/**
 * Handles the message sent from the master.
 *
 * @param {Object} message Message object sent from the master.
 */
function handleMasterMessage(message) {
  switch (message.type) {
      case MessageType.START_SERVER:
        startServer(message.config);
        break;
      default:
        console.error(`Unrecognized message type: ${message.type}`);
  }
}

/**
 * Starts server.
 */
function startServer(config) {
  const expressApp = new express();
  // Disable several response headers.
  expressApp.disable('etag');
  expressApp.disable('x-powered-by');
  // WebHost is expected to run behind a reverse proxy.
  expressApp.set('trust proxy', true);
  // Log incoming requests.
  const accessLogger = new Logger(config.accessLog);
  expressApp.use((request, response, next) => {
    const logEntry = {
        timestamp: (new Date()).toISOString(),
        ip: request.ip,
        method: request.method,
        url: request.originalUrl
    };
    accessLogger.log(JSON.stringify(logEntry), false);
    next();
  });
  // Serve static files by express-static.
  expressApp.use(express.static(
    config.rootDirectory,
    {
      etag: false
    }
  ));
  // File not found.
  expressApp.use((request, response) => {
    let readStream = null;
    response.statusCode = 404;
    response.type('text/html');
    readStream = fs.createReadStream(
      config.errorPage,
      {
        encoding: 'utf8'
      }
    );
    // Cannot read error page.
    readStream.on('error', () => {
      response.statusCode = 500;
      response.type('text/plain');
      response.end('Internal server error.');
    });
    readStream.pipe(response);
  });
  // Create HTTP server.
  try {
    expressApp.listen(config.port);
    console.log(`${(new Date()).toISOString()} Started HTTP server.`);
  } catch (error) {
    console.error(`Unable to start HTTP server: ${error.message}`);
  }
}

/**
 * Initializes worker.
 */
function init() {
    process.on('message', (message) => {
        handleMasterMessage(message);
    });
}

module.exports = {
    init: init
};
