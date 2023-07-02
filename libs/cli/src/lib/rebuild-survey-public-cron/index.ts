import { CronJob } from 'cron';
import {
  main as pullCmsContent,
  config as pullCmsConfig,
} from '../pull-cms-content';
import { sh, updateEnvFile } from '../utils';
import env from './env';

function rebuildSurveyPublic() {
  sh('nx run survey-public:rebuild --mode=production');
}

function contentDidChange() {
  const fileNamesToCheck = pullCmsConfig.map((c) => c.dest);
  const gitStatus = sh('git status --porcelain').split('\n');
  return gitStatus.some((line) => {
    return fileNamesToCheck.some((fileName) => line.includes(fileName));
  });
}

function commitUpdatedContent() {
  sh('git add .');
  sh('git commit -m "Update content"');
}

function moveRebuildFolderToServedDist() {
  sh('mv dist-rebuild dist');
}

function updateLastContentUpdateEnvVar() {
  const lastRebuildDateString = new Date().toISOString();
  const values = { VUE_APP_LAST_CONTENT_UPDATE: lastRebuildDateString };
  const envVarFile = 'apps/survey-public/.env.production';
  updateEnvFile(envVarFile, values);
}

async function cronMain() {
  console.log('Running cron job to rebuild survey-public if needed...');
  await pullCmsContent();

  if (contentDidChange()) {
    console.log('Content changed, rebuilding survey-public...');

    updateLastContentUpdateEnvVar();
    console.log('Successfully updated `VUE_APP_LAST_CONTENT_UPDATE` env var.');

    rebuildSurveyPublic();
    console.log('Successfully rebuilt survey-public.');

    commitUpdatedContent();
    console.log('Successfully committed updated content.');

    moveRebuildFolderToServedDist();
    console.log('Successfully moved rebuild folder to served dist.');

    return;
  }
  console.log('Content did not change, skipping rebuild.');
}

// Run on a per-x-minute basis
const cronExpression = `*/${env.CMS_REFRESH_INTERVAL_MIN} * * * *`;

const job = new CronJob(cronExpression, cronMain, null, false, 'Europe/Vienna');
job.start();
