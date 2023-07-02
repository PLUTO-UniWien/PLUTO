import { CronJob } from 'cron';
import {
  main as pullCmsContent,
  config as pullCmsConfig,
} from '../pull-cms-content';
import { sh } from '../utils';
import env from './env';

function rebuildSurveyPublic() {
  sh('nx run survey-public:build --mode=production');
}

function formatCodebase() {
  sh('nx format:write');
}

function contentDidChange() {
  const fileNamesToCheck = pullCmsConfig.map((c) => c.dest);
  const gitStatus = sh('git status --porcelain').split('\n');
  return gitStatus.some((line) => {
    return fileNamesToCheck.some((fileName) => line.includes(fileName));
  });
}

async function cronMain() {
  console.log('Running cron job to rebuild survey-public if needed...');
  await pullCmsContent();
  console.log('Formatting codebase...');
  formatCodebase();
  if (contentDidChange()) {
    console.log('Content changed, rebuilding survey-public...');
    rebuildSurveyPublic();
    console.log('Successfully rebuilt survey-public.');
    return;
  }
  console.log('Content did not change, skipping rebuild.');
}

// Run on a per-x-minute basis
const cronExpression = `*/${env.CMS_REFRESH_INTERVAL_MIN} * * * *`;

const job = new CronJob(cronExpression, cronMain, null, false, 'Europe/Vienna');
job.start();
