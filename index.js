/**
 * Simple static web server.
 *
 * @author Alex Tsang <alextsang@live.com>
 *
 * @license BSD-3-Clause
 */

'use strict';

const express = require('express');

const EventEmitter = require('events');
const fs = require('fs');
const https = require('https');
const path = require('path');

const EVENT_ERROR_READ_CONFIG_FILE = 'EVENT_ERROR_READ_CONFIG_FILE';
const EVENT_ERROR_PARSE_CONFIG_FILE = 'EVENT_ERROR_PARSE_CONFIG_FILE';
const EVENT_ERROR_READ_TLS_CERTIFICATE = 'EVENT_ERROR_READ_TLS_CERTIFICATE';
const EVENT_ERROR_READ_TLS_PRIVATE_KEY = 'EVENT_ERROR_READ_TLS_PRIVATE_KEY';

const EVENT_READ_CONFIG_FILE = 'EVENT_READ_CONFIG_FILE';
const EVENT_TLS_CONFIG_READY = 'EVENT_TLS_CONFIG_READY';
const EVENT_STARTED_HTTPS_SERVER = 'EVENT_STARTED_HTTPS_SERVER';

const CONFIG_FILE_PATH = path.join(
  __dirname,
  'config.json'
);

const EXIT_CODE_ABNORMAL = 1;

/**
 * WebHost.
 *
 * @extends EventEmitter
 */
class WebHost extends EventEmitter {

  /**
   * Creates a WebHost instance.
   */
  constructor() {
    super();
    this.options = {
      rootDirectory: null,
      errorPage: null,
      tls: null
    };
    this.expressApp = express();
  }

  /**
   * Parses and reads from configuration file.
   */
  readConfig() {
    fs.readFile(
      CONFIG_FILE_PATH,
      {
        encoding: 'utf8'
      },
      (readError, data) => {
        let config = null;
        if (readError !== null) {
          this.emit(EVENT_ERROR_READ_CONFIG_FILE);
          return;
        }
        try {
          config = JSON.parse(data);
          this.options.rootDirectory = config.rootDirectory;
          this.options.errorPage = config.errorPage;
          this.emit(EVENT_READ_CONFIG_FILE, config.tls);
        } catch (parseError) {
          this.emit(EVENT_ERROR_PARSE_CONFIG_FILE);
        }
      }
    );
  }

  /**
   * Reads TLS certificate file and private key, and prepare several TLS
   * configurations.
   *
   * @param {Object} config TLS configurations.
   * @param {String} config.cert Path to TLS certificate.
   * @param {String} config.key Path to TLS private key.
   * @param {String} config.ciphers Ciphers to use, separated by colon.
   * @param {String} config.ecdhCurve The curve used for ECDH key agreement.
   * @param {String} config.secureProtocol The SSL method to use.
   * @param {number} config.port HTTPS server listening port.
   */
  readTLSConfig(config) {
    this.options.tls = {
      cert: null,
      key: null,
      ciphers: config.ciphers,
      ecdhCurve: config.ecdhCurve,
      secureProtocol: config.secureProtocol,
      port: config.port
    };
    fs.readFile(config.cert, (readCertError, cert) => {
      if (readCertError !== null) {
        this.emit(EVENT_ERROR_READ_TLS_CERTIFICATE);
        return;
      }
      this.options.tls.cert = cert;
      fs.readFile(config.key, (readKeyError, key) => {
        if (readKeyError !== null) {
          this.emit(EVENT_ERROR_READ_TLS_PRIVATE_KEY);
          return;
        }
        this.options.tls.key = key;
        this.emit(EVENT_TLS_CONFIG_READY);
      });
    });
  }

  /**
   * Starts server.
   */
  start() {
    // Disable several response headers.
    this.expressApp.disable('etag');
    this.expressApp.disable('x-powered-by');
    // Serve static files by express-static.
    this.expressApp.use(express.static(
      this.options.rootDirectory,
      {
        etag: false
      }
    ));
    // File not found.
    this.expressApp.use((request, response) => {
      let readStream = null;
      response.statusCode = 404;
      response.type('text/html');
      readStream = fs.createReadStream(
        this.options.errorPage,
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
    https.createServer(
      {
        cert: this.options.tls.cert,
        key: this.options.tls.key,
        ciphers: this.options.tls.ciphers,
        ecdhCurve: this.options.tls.ecdhCurve,
        secureProtocol: this.options.tls.secureProtocol
      },
      this.expressApp
    ).listen(this.options.tls.port);
    this.emit(EVENT_STARTED_HTTPS_SERVER);
  }
}

const webHost = new WebHost();
webHost.on(EVENT_ERROR_READ_CONFIG_FILE, () => {
  console.error('Unable to read configuration file.');
  process.exit(EXIT_CODE_ABNORMAL);
})
.on(EVENT_ERROR_PARSE_CONFIG_FILE, () => {
  console.error('Unable to parse configuration file.');
  process.exit(EXIT_CODE_ABNORMAL);
})
.on(EVENT_ERROR_READ_TLS_CERTIFICATE, () => {
  console.error('Unable to read TLS certificate.');
  process.exit(EXIT_CODE_ABNORMAL);
})
.on(EVENT_ERROR_READ_TLS_PRIVATE_KEY, () => {
  console.error('Unable to read TLS private key.');
  process.exit(EXIT_CODE_ABNORMAL);
})
.on(EVENT_READ_CONFIG_FILE, (config) => {
  webHost.readTLSConfig(config);
})
.on(EVENT_TLS_CONFIG_READY, () => {
  webHost.start();
})
.on(EVENT_STARTED_HTTPS_SERVER, () => {
  console.log('HTTPS server started.');
});
webHost.readConfig();
