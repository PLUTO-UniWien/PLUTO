# PLUTO - Development

## Project Setup

### Set Config Key

Create a local `config_key` file in the repository root with the password contents so that all the other secrets can be decrypted.

```shell
CONFIG_KEY=*********
echo "$CONFIG_KEY" > config_key
```

### Decrypt Secrets

Ensure that you have [Docker](https://docs.docker.com/get-docker/) installed on your machine and is running.
Execute the following command to decrypt the secrets.

```shell
npm run secrets:decrypt
```

The command above builds a Docker image with all the necessary system dependencies and runs a container to decrypt the secrets.
Given that you have a local `config_key` file with the correct password, you should see an output like the following:

```text
🔓 Decrypting services/db/.env
🔓 Decrypting services/db-admin/.env
🔓 Decrypting apps/cms/.env
🔓 Decrypting apps/cms/.env.production
🔓 Decrypting apps/cms/export.tar.gz
🔓 Decrypting apps/survey-admin/.env.local
🔓 Decrypting apps/survey-admin/.env.local.docker
🔓 Decrypting apps/survey-public/.env.local
🔓 Decrypting apps/survey-analysis/.streamlit/secrets.toml
```

### Install Local Node Modules

The top-level monorepo dependencies must be installed with the `--force` flag to ensure that all the packages are installed.

```shell
npm ci --force
```

For the Strapi CMS the `node_modules` also need to be installed in the `apps/cms` directory.

```shell
cd apps/cms
npm ci
cd -
```

## Local Development

Start a local PostgreSQL database instance with the following command:

```shell
docker-compose -f docker-compose.dev.yml up -d
```

It is required for the Strapi CMS.

### CMS

The `apps/cms` module is a [Strapi](https://strapi.io/) instance allowing the management of survey contents and website data.
A local dev server can be started with the following command:

```shell
npx nx run cms:serve
```

If executed for the first time (against a clean database), you should see a similar output:

```text
> cms@0.0.1 develop
> strapi develop
Accepting CORS from: [
  'http://localhost:1337',
  'http://localhost:4200',
  'http://localhost:9001',
  'http://cms.pluto.univie.ac.at',
  'https://cms.pluto.univie.ac.at'
]
Accepting CORS from: [
  'http://localhost:1337',
  'http://localhost:4200',
  'http://localhost:9001',
  'http://cms.pluto.univie.ac.at',
  'https://cms.pluto.univie.ac.at'
]
[2024-07-04 20:41:28.227] info: Created admin (E-Mail: dev.petergy@gmail.com, Password: [INIT_ADMIN_PASSWORD]).
 Project information
┌────────────────────┬──────────────────────────────────────────────────┐
│ Time               │ Thu Jul 04 2024 20:41:29 GMT+0200 (Central Euro… │
│ Launched in        │ 2900 ms                                          │
│ Environment        │ development                                      │
│ Process PID        │ 20787                                            │
│ Version            │ 4.14.3 (node v20.11.1)                           │
│ Edition            │ Community                                        │
│ Database           │ postgres                                         │
└────────────────────┴──────────────────────────────────────────────────┘
 Actions available
Welcome back!
To manage your project 🚀, go to the administration panel at:
http://localhost:1337/admin
To access the server ⚡️, go to:
http://localhost:1337
```

You should be able to visit [http://localhost:1337/admin](http://localhost:1337/admin) and log in with the values of `INIT_ADMIN_USERNAME` and `INIT_ADMIN_PASSWORD` specified in `apps/cms/.env`.

### Survey Admin

The `apps/survey-admin` module is a [Next.js](https://nextjs.org/) application that acts as a middleware between the CMS and the frontend.
A local dev server can be started with the following command:

```shell
npx nx run survey-admin:serve
```

You should see a similar output:

```text
> nx run survey-admin:serve:development

Loaded and validated environment variables
[
  'STRAPI_API_KEY',
  'NEXT_PUBLIC_STRAPI_URL',
  'NEXT_PUBLIC_ALLOWED_ORIGINS',
  'NEXT_PUBLIC_USE_AUTH'
]
Loaded and validated environment variables
[
  'STRAPI_API_KEY',
  'NEXT_PUBLIC_STRAPI_URL',
  'NEXT_PUBLIC_ALLOWED_ORIGINS',
  'NEXT_PUBLIC_USE_AUTH'
]
warning package.json: No license field
  ▲ Next.js 13.5.4
  - Local:        http://localhost:4200
  - Environments: .env.local, .env.development
 ✓ Ready in 3.1s
 ✓ Compiled /src/middleware in 193ms (60 modules)
 ✓ Compiled /page in 692ms (387 modules)
```

The UI under [http://localhost:4200](http://localhost:4200) is irrelevant, only the API routes are important in the case of the middleware.
The API routes are defined under `apps/survey-admin/src/app/api`.

### Survey Public

The `apps/survey-public` module is a [Vue 2](https://vuejs.org/) application that serves the frontend of the survey.
The survey component is handled by [SurveyJS](https://surveyjs.io/) under the hood.
A local dev server can be started with the following command:

```shell
npx nx run survey-public:serve
```

You should see a similar output:

```text
> nx run survey-public:serve

 INFO  Starting development server...
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme


 WARNING  Compiled with 1 warning                                                                                                 8:53:55 PM

 warning

DefinePlugin
Conflicting values for 'process.env'


  App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.0.48:8080/

  Note that the development build is not optimized.
  To create a production build, run npm run build.

No issues found.
```

You can visit [http://localhost:8080](http://localhost:8080) to see the survey frontend.

Note that each view under `apps/survey-public/src/views` has a corresponding static `viewname.json` file, housing the contents of the particular view.
These JSON files are periodoically updated by invoking the middleware (`apps/survey-admin`) API routes which in turn fetch the data from the CMS (`apps/cms`). This is a really poor man's way of doing incremental static site generation, something that ideally should have been done with a dedicated framework like [Nuxt.js](https://nuxtjs.org/).

There is a CRON job set up for this purpose, governed by `libs/cli/src/lib/rebuild-survey-public-cron`.
It is invoked automatically in the deployed Docker Stack via:

```shell
nx run cli:start-rebuild-survey-public-cron --apiUrl=$API_URL --apiKey=$API_KEY --interval=$INTERVAL
```

where:

- `$API_URL` is the URL of the middleware API
- `API_KEY` is the API key for the Strapi CMS
- `INTERVAL` is an integer representing the interval in minutes at which the CRON job should run