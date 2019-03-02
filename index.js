/**
 * Simple static web server.
 *
 * @author Alex Tsang <alextsang@live.com>
 *
 * @license BSD-3-Clause
 */

'use strict';

const cluster = require('cluster');
const fs = require('fs');
const os = require('os');
const path = require('path');

const MessageType = require(path.join(
  __dirname,
  'message-type.js'
));
const worker = require(path.join(
  __dirname,
  'worker.js'
));

/**
 * Error messages.
 */
const ERROR_READ_CONFIG_FILE = 'Cannot read configuration file.';
const ERROR_PARSE_CONFIG_FILE = 'Cannot parse configuration file.';

/**
 * Configuration file path.
 */
const CONFIG_FILE_PATH = path.join(
  __dirname,
  'config.json'
);

/**
 * Handles the message sent from the worker.
 *
 * @param {Object} message Message object sent from the worker.
 */
function handleWorkerMessage(message) {
  // TODO: Decide what to do with the message.
}

/**
 * Reads configuration file.
 *
 * @async
 *
 * @param {String} path Configuration file path.
 *
 * @returns {Promise} Promise will resolve with the configuration, or reject
 *                    with error.
 */
async function readConfig(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path,
      {
        encoding: 'utf8'
      },
      (readError, data) => {
        if (readError !== null) {
          reject(new Error(ERROR_READ_CONFIG_FILE));
          return;
        }
        try {
          const config = JSON.parse(data);
          resolve(config);
        } catch (parseError) {
          reject(new Error(ERROR_PARSE_CONFIG_FILE));
        }
      }
    );
  });
}

/**
 * Initializes master.
 */
async function init() {
  let config = null;
  try {
    config = await readConfig(CONFIG_FILE_PATH);
  } catch (readConfigError) {
    console.error(
      `Unable to read configuration file: ${readConfigError.message}`);
    return;
  }
  const workerCount = os.cpus().length;
  console.log(`${workerCount} workers will be started.`);
  for (let i = 0; i < workerCount; i++) {
      const worker = cluster.fork();
      worker.send({
        type: MessageType.START_SERVER,
        config: config
      });
  }
  cluster.on('message', (worker, message) => {
      handleWorkerMessage(message);
  });
  cluster.on('exit', (worker, code, signal) => {
      if (signal !== undefined) {
          console.log(`Worker #${worker.id} killed by signal ${signal}.`);
          return;
      }
      if (code !== 0) {
          console.error(`Worker #${worker.id} exit with code ${code}.`);
          return;
      }
      console.log(`Worker #${worker.id} exit successfully.`);
  });
}

if (cluster.isMaster) {
  init();
  return;
}

worker.init();
