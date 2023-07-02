import env from './env';
import * as fs from 'fs';

const config = [
  {
    apiPath: '/content/home',
    dest: 'apps/survey-public/src/views/home/home.json',
  },
  {
    apiPath: '/content/result',
    dest: 'apps/survey-public/src/views/result/result.json',
  },
];

function fetchOne(apiPath: string) {
  return fetch(`${env.API_URL}/api${apiPath}`, {
    headers: {
      Authorization: `bearer ${env.STRAPI_API_KEY}`,
    },
  })
    .then((res) => res.json())
    .then((res) => res.data);
}

async function fetchAndWrite(apiPath: string, dest: string) {
  const data = await fetchOne(apiPath);
  const dataToWrite = JSON.stringify({ data }, null, 2);
  fs.writeFileSync(dest, dataToWrite);
}

async function main() {
  for (const { apiPath, dest } of config) {
    console.log(`Fetching ${apiPath} and writing to ${dest}`);
    await fetchAndWrite(apiPath, dest);
  }
}

main().then(() => console.log('Done!'));
