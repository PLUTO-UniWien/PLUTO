module.exports = {
  apps: [
    {
      name: 'survey-public',
      script: 'npx',
      args: 'serve --debug --no-clipboard --cors --no-compression -p 8080 --single dist/apps/survey-public',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'survey-public-rebuild-cron',
      script: 'nx',
      args: 'run cli:start-rebuild-survey-public-cron --apiUrl=$API_URL --apiKey=$API_KEY --interval=$REFRESH_INTERVAL_MINUTES',
      env: {
        API_URL: process.env.API_URL,
        API_KEY: process.env.API_KEY,
        REFRESH_INTERVAL_MINUTES: process.env.REFRESH_INTERVAL_MINUTES,
      },
    },
  ],
};
