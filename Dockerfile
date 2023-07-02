# Using bookworm, a Debian-based Node image, since Python needs to be available to install the project dependencies.
FROM node:18-bookworm AS base
RUN apt-get update &&  \
    apt-get install -y build-essential jq

FROM base AS nx-base
WORKDIR /app

# Make sure that we are running the latest version of npm
RUN npm install -g npm@latest

# Install NX CLI
RUN npm install --global nx@latest

# Install node dependencies
COPY package*.json ./
RUN npm install --force

# Copy all non-docker-ignored files from the current directory into the container to be accessed by child images
COPY . .
