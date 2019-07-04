/**
 * Access logger middleware.
 *
 * @author Alex TSANG <alextsang@live.com>
 *
 * @license BSD-3-Clause
 */

'use strict';

const fs = require('fs');

const config = require('../config.js');

/**
 * Gets the middleware which will log the incoming request.
 *
 * @returns {Function} The middleware.
 */
const getMiddleware = () => (request, response, next) => {
  const entry = {
    timestamp: (new Date()).toISOString(),
    ip: request.ip,
    method: request.method,
    url: request.originalUrl
  };
  fs.appendFile(
    config.accessLog,
    `${JSON.stringify(entry)}\n`,
    (error) => {
      if (error !== null) {
        console.error(`Unable to write access log: ${error.message}`);
      }
      next();
    }
  );
};

module.exports = {
  getMiddleware
};
