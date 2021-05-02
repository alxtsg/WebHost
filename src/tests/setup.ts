import fs from 'fs';
import path from 'path';

const ENV_FILE: string = path.join(__dirname, '..', '.env');
const ENV_CONTENT: string = [
  'ROOT_DIRECTORY=web',
  'PORT=8080',
  `ERROR_PAGE=${path.join('web', '404.html')}`,
  `ACCESS_LOG=${path.join('logs', 'access.log')}`,
].join('\n');

const fsPromises = fs.promises;

const main = async (): Promise<void> => {
  await fsPromises.writeFile(ENV_FILE, ENV_CONTENT)
};

main();
