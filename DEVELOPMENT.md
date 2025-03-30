# PLUTO - Public Value Assessment Tool

## Environment Setup

Clone the repository

```bash
git clone git@github.com:PLUTO-UniWien/PLUTO.git && cd PLUTO
```

Install dependencies

```bash
pnpm install
```

### `cms` ([Strapi](https://github.com/strapi/strapi))

Create local environment variables for Strapi

```bash
# Make sure to edit the .env file to your needs
cp packages/cms/.env.example packages/cms/.env
```

Start the Strapi dev server

```bash
pnpm --filter cms run dev
```

Initialize CMS from export

```bash
cd packages/cms
./node_modules/.bin/strapi import -f exports/export_20250330153618.tar.gz
```

Open the Strapi admin panel in your browser running on
[http://localhost:1337/admin](http://localhost:1337/admin) and login with the
admin credentials you set in the `.env` file.

### `web` ([Next.js](https://github.com/vercel/next.js/))

Create local environment variables for the Next.js app

```bash
# Make sure you are in the root directory of the project and you edit the .env.local file to your needs
cd ../../
cp packages/web/.env.local.example packages/web/.env.local
```

Start the Next.js dev server

```bash
pnpm --filter web run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
application running.
