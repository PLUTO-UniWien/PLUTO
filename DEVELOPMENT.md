# PLUTO - Public Value Assessment Tool

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js v22](https://nodejs.org/en/)
- [pnpm v10](https://pnpm.io/)

## Initial Setup

Clone the repository

```bash
git clone git@github.com:PLUTO-UniWien/PLUTO.git && cd PLUTO
```

Install dependencies

```bash
pnpm install
```

### `cms` ([Strapi](https://github.com/strapi/strapi))

Create local environment variables for Strapi based on the
[packages/cms/.env.example](packages/cms/.env.example) file.

```bash
# Make sure to edit the .env file to your needs
cp packages/cms/.env.example packages/cms/.env
```

Start the Strapi dev server

```bash
pnpm --filter cms run dev
```

You should see something along the lines of:

```
> strapi develop

⠦ Loading Strapi[2025-03-30 15:59:40.953] info: Created admin (E-Mail: john.doe@admin.com, Password: [INIT_ADMIN_PASSWORD]).
⠋ Building build context
⠧ Loading Strapi[INFO] Including the following ENV variables as part of the JS bundle:
    - ADMIN_PATH
    - STRAPI_ADMIN_BACKEND_URL
    - STRAPI_TELEMETRY_DISABLED
✔ Building build context (42ms)
✔ Creating admin (338ms)
✔ Loading Strapi (2288ms)
✔ Generating types (155ms)
✔ Cleaning dist dir (10ms)
✔ Compiling TS (892ms)

 Project information

┌────────────────────┬──────────────────────────────────────────────────┐
│ Time               │ Sun Mar 30 2025 15:59:42 GMT+0200 (Central Euro… │
│ Launched in        │ 3343 ms                                          │
│ Environment        │ development                                      │
│ Process PID        │ 32359                                            │
│ Version            │ 5.12.1 (node v22.14.0)                           │
│ Edition            │ Community                                        │
│ Database           │ sqlite                                           │
│ Database name      │ .tmp/data.db                                     │
└────────────────────┴──────────────────────────────────────────────────┘

 Actions available

Welcome back!
To access the server ⚡️, go to:
http://localhost:1337

[2025-03-30 15:59:42.562] info: Strapi started successfully
```

Now, in a separate terminal session initialize CMS from export to include the
default content and settings.

```bash
cd packages/cms
./node_modules/.bin/strapi import -f exports/export_20250330153618.tar.gz --force
```

You should see something along the lines of:

```
? The import will delete your existing data! Are you sure you want to proceed? Yes
Starting import...
✔ entities: 93 transfered (size: 177.2 KB) (elapsed: 123 ms) (1.4 MB/s)
✔ assets: 12 transfered (size: 439.1 KB) (elapsed: 35 ms) (12.3 MB/s)
✔ links: 303 transfered (size: 53.4 KB) (elapsed: 17 ms) (3.1 MB/s)
✔ configuration: 49 transfered (size: 148.1 KB) (elapsed: 7 ms) (20.7 MB/s)
┌─────────────────────────────────────────────────────────┬───────┬───────────────┐
│ Type                                                    │ Count │ Size          │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ entities                                                │    93 │     177.2 KB  │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- api::feedback-page.feedback-page                     │     2 │ (     2.9 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- api::glossary-page.glossary-page                     │     2 │ (    12.4 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- api::home-page.home-page                             │     2 │ (    10.3 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- api::imprint-page.imprint-page                       │     2 │ (     2.1 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- api::post.post                                       │     2 │ (     7.5 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- api::privacy-page.privacy-page                       │     2 │ (     2.7 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- api::question.question                               │    50 │ (    98.5 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- api::result-page.result-page                         │     2 │ (     8.4 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- api::submission.submission                           │     4 │ (    12.8 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- api::survey.survey                                   │     2 │ (     942 B ) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- api::weighting-history-page.weighting-history-page   │     2 │ (     3.4 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- api::weighting-overview-page.weighting-overview-page │     2 │ (     6.7 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::i18n.locale                                  │     1 │ (     253 B ) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::upload.file                                  │     4 │ (     4.2 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::upload.folder                                │     3 │ (     787 B ) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::users-permissions.permission                 │     9 │ (     2.6 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::users-permissions.role                       │     2 │ (     656 B ) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ assets                                                  │    12 │     439.1 KB  │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- .csv                                                 │     1 │ (     6.5 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- .png                                                 │    10 │ (   399.6 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ -- .xlsx                                                │     1 │ (      33 KB) │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ links                                                   │   303 │      53.4 KB  │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ configuration                                           │    49 │     148.1 KB  │
├─────────────────────────────────────────────────────────┼───────┼───────────────┤
│ Total                                                   │   457 │     817.9 KB  │
└─────────────────────────────────────────────────────────┴───────┴───────────────┘
Import process has been completed successfully!
```

Open the Strapi admin panel in your browser running on
[http://localhost:1337/admin](http://localhost:1337/admin) and login with the
admin credentials you set in the `.env` file.

Now issue a new API Token by visiting
[http://localhost:1337/admin/settings/api-tokens/create](http://localhost:1337/admin/settings/api-tokens/create).
Set `Token duration` to `Unlimited` and `Token type` to `Full access`. This will
be the value of `STRAPI_API_TOKEN` in `packages/web/.env.local` allowing the
Next.js app to access the CMS via its API.

As a final step, you will need to sync the `STRAPI_WEBHOOK_SECRET` by visiting
`Strapi Admin > Settings > Webhooks > Revalidate Pages` and set the
`Authorization` header's value. This will be the value of `STRAPI_WEBHOOK_SECRET` in `packages/web/.env.local`.

### `web` ([Next.js](https://github.com/vercel/next.js/))

Create local environment variables for the Next.js app based on the
[packages/web/.env.local.example](packages/web/.env.local.example) file.

Specify `STRAPI_API_TOKEN` and `STRAPI_WEBHOOK_SECRET` as outlined in the
previous section.

```bash
# Make sure you are in the root directory of the project and you edit the .env.local file to your needs
cd ../../
cp packages/web/.env.local.example packages/web/.env.local
```

Optionally, also connect the web app to a [Umami Analytics](https://umami.is/)
instance of your choice by specifying the `NEXT_PUBLIC_UMAMI_SCRIPT_URL` and
`NEXT_PUBLIC_UMAMI_WEBSITE_ID` environment variables.

Start the Next.js dev server

```bash
pnpm --filter web run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
application running.

## Development

After going through the initial setup, you can work on the project by running
the `dev` target of both packages in parallel via

```
pnpm run -r dev
```
