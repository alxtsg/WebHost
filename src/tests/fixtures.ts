import server from '../server';

export async function mochaGlobalSetup() {
  await server.ready();
}

export async function mochaGlobalTeardown() {
  await server.close();
}
