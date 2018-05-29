/**
 * Logger.
 *
 * @author Alex Tsang <alextsang@live.com>
 *
 * @license BSD-3-Clause
 */

'use strict';

const fs = require('fs');

class Logger {

  /**
   * Constructor.
   *
   * @param {String} filename Filename of log.
   */
  constructor(filename) {
    this.filename = filename;
  }

  /**
   * Logs a message.
   *
   * @param {String} message Log message.
   */
  log(message) {
    const line = `${(new Date()).toISOString()} ${message}\n`;
    fs.appendFile(this.filename, line, (error) => {
      if (error !== null) {
        throw error;
      }
    });
  }
}

module.exports = Logger;
