import server from './server.js';

process.on('beforeExit', () => {
  server.close()
    .then(
      () => {
        console.log('Server is stopped.');
      },
      (error: Error) => {
        console.error('Unable to stop server.');
        console.error(error);
      }
    );
});
