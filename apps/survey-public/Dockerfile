FROM pluto:nx-base
# The whole monorepo source is already copied under /app
WORKDIR /app

# Setup dummy git repo so that the rebuild CRON process can diff the changes
RUN git config --global user.email "pluto-bot@localhost" && \
    git config --global user.name "PLUTO-bot" && \
    git config --global init.defaultBranch main && \
    git init &&  \
    git add . &&  \
    git commit -m "Initial commit"

# If mode is deployment we use the `.env.production.docker` to load env vars to use the production backend domain
ARG DOCKER_MODE=deployment
ENV DOCKER_MODE=$DOCKER_MODE
RUN if [ "$DOCKER_MODE" = "deployment" ]; then cd apps/survey-public/ && mv .env.production.docker .env.production && cd -; fi


# produce a production build and output it to /app/dist/apps/survey-public
RUN nx run survey-public:build --mode production

# Upgrade npm
RUN npm install -g npm@latest
# Install additional deps to serve the app
RUN npm install -g pm2 serve

COPY ./apps/survey-public/healthcheck.js /app
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
    CMD node /app/healthcheck.js

# Using pm2-runtime instead of pm2 with the --no-daemon flag,
# since we start 2 processes and want the container to keep running
CMD ["pm2-runtime", "start", "apps/survey-public/ecosystem.config.js"]
