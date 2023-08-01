#!/usr/bin/env bash

echo "🔓Decrypting secrets"
bash ./scripts/secrets.sh --decrypt

echo "🐳Building Docker images"
docker build -t pluto:nx-base .
docker-compose build

echo "🚀(Re)Starting Docker containers"
docker-compose down
docker-compose up -d --force-recreate --remove-orphans
