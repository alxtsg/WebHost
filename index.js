/**
 * Simple static web server.
 *
 * @author Alex Tsang <alextsang@live.com>
 *
 * @license BSD-3-Clause
 */

'use strict';

const express = require('express');

const fs = require('fs');
const http = require('http');
const path = require('path');

const Logger = require(path.join(
  __dirname,
  'logger.js'
));

const ERROR_READ_CONFIG_FILE = 'Cannot read configuration file.';
const ERROR_PARSE_CONFIG_FILE = 'Cannot parse configuration file.';
const ERROR_READ_TLS_CERTIFICATE = 'Cannot read TLS certificate.';
const ERROR_READ_TLS_PRIVATE_KEY = 'Cannot read TLS private key.';

const CONFIG_FILE_PATH = path.join(
  __dirname,
  'config.json'
);

const serverConfig = {
  rootDirectory: null,
  errorPage: null,
  accessLog: null,
  port: null
};
const expressApp = express();

let accessLogger = null;

/**
 * Reads configuration file.
 */
function readConfig() {
  return new Promise((resolve, reject) => {
    fs.readFile(
      CONFIG_FILE_PATH,
      {
        encoding: 'utf8'
      },
      (readError, data) => {
        let config = null;
        if (readError !== null) {
          reject(new Error(ERROR_READ_CONFIG_FILE));
          return;
        }
        try {
          config = JSON.parse(data);
          serverConfig.rootDirectory = config.rootDirectory;
          serverConfig.errorPage = config.errorPage;
          serverConfig.accessLog = config.accessLog;
          serverConfig.port = config.port;
          resolve();
        } catch (parseError) {
          reject(new Error(ERROR_PARSE_CONFIG_FILE));
        }
      }
    );
  });
}

/**
 * Starts server.
 */
function start() {
  return new Promise((resolve, reject) => {
    // Disable several response headers.
    expressApp.disable('etag');
    expressApp.disable('x-powered-by');
    // WebHost is expected to run behind a reverse proxy.
    expressApp.set('trust proxy', true);
    // Log incoming requests.
    accessLogger = new Logger(serverConfig.accessLog);
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
      serverConfig.rootDirectory,
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
        serverConfig.errorPage,
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
      expressApp.listen(serverConfig.port);
      console.log(`${(new Date()).toISOString()} Started HTTP server.`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

readConfig()
  .then(start)
  .catch((error) => {
    console.error(`${(new Date()).toISOString()} ${error.message}`);
  });
