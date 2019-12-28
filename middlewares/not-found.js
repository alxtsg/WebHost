/**
 * HTTP 404 Not Found middleware.
 *
 * @author Alex TSANG <alextsang@live.com>
 *
 * @license BSD-3-Clause
 */

const fs = require('fs');

const config = require('../config.js');

/**
 * Gets the middleware which will respond to the client with an HTTP 404 eror.
 * The middleware will terminate the request-response cycle.
 *
 * @returns {Function} The middleware.
 */
const getMiddleware = () => (request, response) => {
  response.statusCode = 404;
  response.type('text/html');
  const readStream = fs.createReadStream(
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
};

module.exports = getMiddleware;
