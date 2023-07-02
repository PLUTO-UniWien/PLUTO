FROM pluto:nx-base
# The whole monorepo source is already copied under /app
WORKDIR /app

# produce a production build and output it to /app/dist/apps/survey-public
RUN nx run survey-public:build --mode production

# Upgrade npm
RUN npm install -g npm@latest
# Install additional deps to serve the app
RUN npm install -g pm2 serve

CMD ["pm2", "start", "apps/survey-public/ecosystem.config.js", "--no-daemon"]
