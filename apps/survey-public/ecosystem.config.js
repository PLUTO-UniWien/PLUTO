module.exports = {
  apps: [
    {
      name: 'survey-public',
      script: 'serve',
      args: '--debug --single -p 8080 dist/apps/survey-public',
      interpreter: 'none',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'survey-public-rebuild-cron',
      script: 'nx',
      args: 'run cli:start-rebuild-survey-public-cron --apiUrl=$API_URL --apiKey=$API_KEY --interval=$REFRESH_INTERVAL_MINUTES',
    },
  ],
};
