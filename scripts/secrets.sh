#!/usr/bin/env bash

SECRET_PATHS=(
  "services/db/.env"
  "services/db-admin/.env"
  "apps/cms/.env"
  "apps/cms/.env.production"
  "apps/survey-admin/.env.local"
  "apps/survey-analysis/.streamlit/secrets.toml"
)

CONFIG_KEY_FILE="config_key"

# Make sure that the config key file exists
if [ ! -f "$CONFIG_KEY_FILE" ]; then
  echo -e "\033[0;31mConfig key file not found. Please create it and try again.\033[0m"
  exit 1
fi

GPG_PASSPHRASE="$(cat $CONFIG_KEY_FILE)"

# method to decrypt secrets
function decrypt_secrets() {
  for path in "${SECRET_PATHS[@]}"; do
    echo "🔓Decrypting $path"
    gpg --quiet --batch --yes --passphrase "$GPG_PASSPHRASE" --decrypt --output "$path" "$path.gpg"
  done
}

# method to encrypt secrets
function encrypt_secrets() {
  for path in "${SECRET_PATHS[@]}"; do
    echo "🔐Encrypting $path"
    gpg --quiet --batch --yes --passphrase "$GPG_PASSPHRASE" --symmetric --cipher-algo AES256 "$path"
  done
}

# Two flags: --decrypt and --encrypt
while [[ "$#" -gt 0 ]]; do
  case $1 in
  -d | --decrypt) decrypt_secrets ;;
  -e | --encrypt) encrypt_secrets ;;
  *) echo "Unknown parameter passed: $1" ;;
  esac
  shift
done
