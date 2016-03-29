/**
 * Simple static web server.
 *
 * @author Alex Tsang <alextsang@live.com>
 */
(function () {
  'use strict';

  var events = require('events'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    util = require('util'),

    express = require('express'),

    EVENT_ERROR_READ_CONFIG_FILE = 'EVENT_ERROR_READ_CONFIG_FILE',
    EVENT_ERROR_PARSE_CONFIG_FILE = 'EVENT_ERROR_PARSE_CONFIG_FILE',
    EVENT_ERROR_READ_TLS_CERTIFICATE = 'EVENT_ERROR_READ_TLS_CERTIFICATE',
    EVENT_ERROR_READ_TLS_PRIVATE_KEY = 'EVENT_ERROR_READ_TLS_PRIVATE_KEY',
    EVENT_TLS_ENABLED = 'EVENT_TLS_ENABLED',
    EVENT_SERVER_OPTIONS_READY = 'EVENT_SERVER_OPTIONS_READY',
    EVENT_STARTED_HTTP_SERVER = 'EVENT_STARTED_HTTP_SERVER',
    EVENT_STARTED_HTTPS_SERVER = 'EVENT_STARTED_HTTPS_SERVER',

    CONFIG_FILE_PATH = 'config.json',

    EXIT_CODE_ABNORMAL = 1,

    /**
     * Constructor. Initialize web server options and Express instance.
     *
     * @class
     */
    WebHost = function () {
      events.EventEmitter.call(this);
      this.options = {
        rootDirectory: null,
        errorPage: null,
        port: null,
        tls: null
      };
      this.expressApp = express();
    },

    webHost = null;

  util.inherits(WebHost, events.EventEmitter);

  /**
   * Parses and reads from configuration file.
   */
  WebHost.prototype.readConfig = function () {
    var self = this;
    fs.readFile(
      CONFIG_FILE_PATH,
      {
        encoding: 'utf8'
      },
      function (readError, data) {
        var config = null;
        if (readError !== null) {
          self.emit(EVENT_ERROR_READ_CONFIG_FILE);
          return;
        }
        try {
          config = JSON.parse(data);
          self.options.rootDirectory = config.rootDirectory;
          self.options.errorPage = config.errorPage;
          self.options.port = config.port;
          if (config.tls !== null) {
            self.emit(EVENT_TLS_ENABLED, config.tls);
          } else {
            self.emit(EVENT_SERVER_OPTIONS_READY);
          }
        } catch (parseError) {
          self.emit(EVENT_ERROR_PARSE_CONFIG_FILE);
        }
      }
    );
  };

  /**
   * Reads TLS certificate file and private key.
   */
  WebHost.prototype.readTLSConfig = function (config) {
    var self = this;
    self.options.tls = {
      cert: null,
      key: null,
      ciphers: null,
      // Mitigate BEAST attacks.
      honorCipherOrder: true,
      port: null
    };
    fs.readFile(config.cert, function (readCertError, cert) {
      if (readCertError !== null) {
        self.emit(EVENT_ERROR_READ_TLS_CERTIFICATE);
        return;
      }
      self.options.tls.cert = cert;
      fs.readFile(config.key, function (readKeyError, key) {
        if (readKeyError !== null) {
          self.emit(EVENT_ERROR_READ_TLS_PRIVATE_KEY);
          return;
        }
        self.options.tls.key = key;
        self.options.tls.ciphers = config.ciphers;
        self.options.tls.port = config.port;
        self.emit(EVENT_SERVER_OPTIONS_READY);
      });
    });
  };

  /**
   * Starts server.
   */
  WebHost.prototype.start = function () {
    var self = this;
    // Disable several response headers.
    self.expressApp.disable('etag');
    self.expressApp.disable('x-powered-by');
    // Serve static files by express-static.
    self.expressApp.use(express.static(
      self.options.rootDirectory,
      {
        etag: false
      }
    ));
    // File not found.
    self.expressApp.use(function (request, response) {
      var readStream = null;
      response.statusCode = 404;
      response.type('text/html');
      readStream = fs.createReadStream(
        self.options.errorPage,
        {
          encoding: 'utf8'
        }
      );
      // Cannot read error page.
      readStream.on('error', function (error) {
        response.statusCode = 500;
        response.type('text/plain');
        response.end('Internal server error.');
      });
      readStream.pipe(response);
    });
    // Listen for incoming traffic.
    http.createServer(self.expressApp)
      .listen(self.options.port);
    if (self.options.tls !== null) {
      https.createServer(
        {
          cert: self.options.tls.cert,
          key: self.options.tls.key,
          ciphers: self.options.tls.ciphers
        },
        self.expressApp
      ).listen(self.options.tls.port);
    }
  };

  webHost = new WebHost();
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
