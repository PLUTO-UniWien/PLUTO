import env from './env';
import * as fs from 'fs';

export const config = [
  {
    apiPath: '/content/home',
    dest: 'apps/survey-public/src/views/home/home.json',
  },
  {
    apiPath: '/content/result',
    dest: 'apps/survey-public/src/views/result/result.json',
  },
  {
    apiPath: '/survey',
    dest: 'libs/survey-model/src/lib/static/survey.json',
  },
];

function fetchOne(apiPath: string) {
  return fetch(`${env.API_URL}/api${apiPath}`, {
    headers: {
      Authorization: `bearer ${env.STRAPI_API_KEY}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(
          `Error fetching ${apiPath}: ${res.status} ${res.statusText}`
        );
      }
      return res;
    })
    .then((res) => res.json())
    .then((res) => res.data);
}

async function fetchAndWrite(apiPath: string, dest: string) {
  const data = { data: await fetchOne(apiPath) };
  const dataToWrite = JSON.stringify(data, null, 2);
  const oldData = JSON.stringify(loadJsonFromFile(dest), null, 2);
  const shouldWrite = dataToWrite !== oldData;
  if (shouldWrite) {
    console.log(`Data changed. Writing ${dest}...`);
    fs.writeFileSync(dest, dataToWrite);
  }
  return dataToWrite !== oldData;
}

function loadJsonFromFile(path: string) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

export async function main() {
  return await config.reduce(async (accPromise, { apiPath, dest }) => {
    const acc = await accPromise;
    console.log(`Fetching ${apiPath} and writing to ${dest} if changed...`);
    const didWrite = await fetchAndWrite(apiPath, dest);
    acc.push({ apiPath, dest, didWrite });
    return acc;
  }, Promise.resolve([] as (typeof config[0] & { didWrite: boolean })[]));
}

if (env.SHOULD_RUN_STANDALONE) {
  main().then(console.log).catch(console.error);
}
