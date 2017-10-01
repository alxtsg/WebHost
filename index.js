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
const https = require('https');
const path = require('path');

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
  tls: {
    cert: null,
    key: null,
    ciphers: null,
    ecdhCurve: null,
    secureProtocol: null,
    port: null
  }
};
const expressApp = express();

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
          serverConfig.tls.ciphers = config.tls.ciphers,
          serverConfig.tls.ecdhCurve = config.tls.ecdhCurve,
          serverConfig.tls.secureProtocol = config.tls.secureProtocol,
          serverConfig.tls.port = config.tls.port
          fs.readFile(config.tls.cert, (readCertError, cert) => {
            if (readCertError !== null) {
              reject(new Error(ERROR_READ_TLS_CERTIFICATE));
              return;
            }
            serverConfig.tls.cert = cert;
            fs.readFile(config.tls.key, (readKeyError, key) => {
              if (readKeyError !== null) {
                reject(new Error(ERROR_READ_TLS_PRIVATE_KEY));
                return;
              }
              serverConfig.tls.key = key;
              resolve();
            });
          });
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
    // Create HTTPS server.
    try {
      https.createServer(
        {
          cert: serverConfig.tls.cert,
          key: serverConfig.tls.key,
          ciphers: serverConfig.tls.ciphers,
          ecdhCurve: serverConfig.tls.ecdhCurve,
          secureProtocol: serverConfig.tls.secureProtocol
        },
        expressApp
      ).listen(serverConfig.tls.port);
      console.log('Started HTTPS server.');
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

readConfig()
  .then(start)
  .catch((error) => {
    console.error(error.message);
  });
