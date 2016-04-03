/**
 * Simple static web server.
 *
 * @author Alex Tsang <alextsang@live.com>
 *
 * @license BSD-3-Clause
 */
(function () {
  'use strict';

  const EventEmitter = require('events'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),

    express = require('express'),

    EVENT_ERROR_READ_CONFIG_FILE = 'EVENT_ERROR_READ_CONFIG_FILE',
    EVENT_ERROR_PARSE_CONFIG_FILE = 'EVENT_ERROR_PARSE_CONFIG_FILE',
    EVENT_ERROR_READ_TLS_CERTIFICATE = 'EVENT_ERROR_READ_TLS_CERTIFICATE',
    EVENT_ERROR_READ_TLS_PRIVATE_KEY = 'EVENT_ERROR_READ_TLS_PRIVATE_KEY',
    EVENT_ERROR_READ_DHPARAM = 'EVENT_ERROR_READ_DHPARAM',
    EVENT_TLS_ENABLED = 'EVENT_TLS_ENABLED',
    EVENT_SERVER_OPTIONS_READY = 'EVENT_SERVER_OPTIONS_READY',
    EVENT_STARTED_HTTP_SERVER = 'EVENT_STARTED_HTTP_SERVER',
    EVENT_STARTED_HTTPS_SERVER = 'EVENT_STARTED_HTTPS_SERVER',

    CONFIG_FILE_PATH = 'config.json',

    EXIT_CODE_ABNORMAL = 1;

  /**
   * WebHost.
   *
   * @extends EventEmitter
   */
  class WebHost extends EventEmitter {

    /**
     * Creates a WebHost instance.
     */
    constructor () {
      super();
      this.options = {
        rootDirectory: null,
        errorPage: null,
        port: null,
        tls: null
      };
      this.expressApp = express();
    }

    /**
     * Parses and reads from configuration file.
     */
    readConfig () {
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
            this.options.port = config.port;
            if (config.tls !== null) {
              this.emit(EVENT_TLS_ENABLED, config.tls);
            } else {
              this.emit(EVENT_SERVER_OPTIONS_READY);
            }
          } catch (parseError) {
            this.emit(EVENT_ERROR_PARSE_CONFIG_FILE);
          }
        }
      );
    }

    /**
     * Reads TLS certificate file and private key.
     *
     * @param {Object} config TLS configurations.
     * @param {string} config.cert Path to TLS certificate.
     * @param {string} config.key Path to TLS private key.
     * @param {string} config.ciphers Ciphers to use, separated by colon.
     * @param {string} config.dhParam Path to DH parameters file.
     * @param {number} config.port HTTPS server listening port.
     */
    readTLSConfig (config) {
      this.options.tls = {
        cert: null,
        key: null,
        ciphers: null,
        dhParam: null,
        // Mitigate BEAST attacks.
        honorCipherOrder: true,
        port: null
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
          this.options.tls.ciphers = config.ciphers;
          fs.readFile(config.dhParam, (readDHparamError, dhParam) => {
            if (readDHparamError !== null) {
              this.emit(EVENT_ERROR_READ_DHPARAM);
              return;
            }
            this.options.tls.dhParam = dhParam;
            this.options.tls.port = config.port;
            this.emit(EVENT_SERVER_OPTIONS_READY);
          });
        });
      });
    }

    /**
     * Starts server.
     */
    start () {
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
        readStream.on('error', (error) => {
          response.statusCode = 500;
          response.type('text/plain');
          response.end('Internal server error.');
        });
        readStream.pipe(response);
      });
      // Listen for incoming traffic.
      http.createServer(this.expressApp)
        .listen(this.options.port);
      if (this.options.tls !== null) {
        https.createServer(
          {
            cert: this.options.tls.cert,
            key: this.options.tls.key,
            ciphers: this.options.tls.ciphers,
            dhparam: this.options.tls.dhParam
          },
          this.expressApp
        ).listen(this.options.tls.port);
      }
    }
  }

  let webHost = new WebHost();
  webHost.on(EVENT_ERROR_READ_CONFIG_FILE, function () {
    console.error('Unable to read configuration file.');
    process.exit(EXIT_CODE_ABNORMAL);
  }).on(EVENT_ERROR_PARSE_CONFIG_FILE, function () {
    console.error('Unable to parse configuration file.');
    process.exit(EXIT_CODE_ABNORMAL);
  }).on(EVENT_ERROR_READ_TLS_CERTIFICATE, function () {
    console.error('Unable to read TLS certificate.');
    process.exit(EXIT_CODE_ABNORMAL);
  }).on(EVENT_ERROR_READ_TLS_PRIVATE_KEY, function () {
    console.error('Unable to read TLS private key.');
    process.exit(EXIT_CODE_ABNORMAL);
  }).on(EVENT_ERROR_READ_DHPARAM, function () {
    console.error('Unable to read DH parameters.');
    process.exit(EXIT_CODE_ABNORMAL);
  }).on(EVENT_TLS_ENABLED, function (tlsConfig) {
    webHost.readTLSConfig(tlsConfig);
  }).on(EVENT_SERVER_OPTIONS_READY, function () {
    webHost.start();
  }).on(EVENT_STARTED_HTTP_SERVER, function () {
    console.log('HTTP server started.');
  }).on(EVENT_STARTED_HTTPS_SERVER, function () {
    console.log('HTTPS server started.');
  });
  webHost.readConfig();
}());
