/**
 * Logger.
 *
 * @author Alex TSANG <alextsang@live.com>
 *
 * @license BSD-3-Clause
 */

'use strict';

const fs = require('fs');

class Logger {

  /**
   * Constructor.
   *
   * @param {string} filename Filename of log.
   */
  constructor(filename) {
    this.filename = filename;
  }

  /**
   * Logs a message.
   *
   * @param {string} message Log message.
   * @param {boolean} hasTimestamp Prepend log message with a timestamp or not.
   *
   * @throws {Error} When unable to log the message.
   */
  log(message, hasTimestamp = true) {
    let line = null;
    if (hasTimestamp) {
      line = `${(new Date()).toISOString()} ${message}\n`;
    } else {
      line = `${message}\n`;
    }
    fs.appendFile(this.filename, line, (error) => {
      if (error !== null) {
        throw error;
      }
    });
  }
}

module.exports = Logger;
