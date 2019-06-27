/**
 * Simple static web server.
 *
 * @author Alex TSANG <alextsang@live.com>
 *
 * @license BSD-3-Clause
 */

'use strict';

const cluster = require('cluster');
const os = require('os');
const path = require('path');

const config = require('./config.js');

const MessageType = require(path.join(
  __dirname,
  'message-type.js'
));
const worker = require(path.join(
  __dirname,
  'worker.js'
));

/**
 * Handles the message sent from the worker.
 *
 * @param {object} message Message object sent from the worker.
 */
const handleWorkerMessage = (message) => {
  // TODO: Decide what to do with the message.
};

/**
 * Initializes master.
 */
const init = () => {
  const workerCount = os.cpus().length;
  console.log(`${workerCount} workers will be started.`);
  for (let i = 0; i < workerCount; i++) {
    const worker = cluster.fork();
    worker.send({
      type: MessageType.START_SERVER,
      config
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
};

if (cluster.isMaster) {
  init();
  return;
}

worker.init();
