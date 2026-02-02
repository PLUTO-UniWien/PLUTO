# AGENTS - PLUTO Repository Handoff & QA Rules

These rules apply to the whole repository (all packages).

## Non-negotiables (before any handoff / PR review / merge)

- **All QA must pass.** Do not hand off “untested” changes.
- **No failing builds, no failing linters, no failing audits.**
- **Lockfiles are part of the contract.** If dependencies change, `pnpm-lock.yaml` and/or `packages/analytics/uv.lock` must be updated and committed.
- **No secrets committed.** Never commit `.env`, `.env.local`, database files, exports, or tokens.

## Required Toolchain

- **Node:** v24 (use `nvm use` in repo root; `.nvmrc` is authoritative)
- **Package manager:** `pnpm` via Corepack (see `package.json#packageManager`)
- **Python (analytics):** CPython >= 3.13, managed via `uv`

## Required QA Commands (run from repo root)

1) Install / bootstrap
```bash
nvm use
pnpm install
```

2) Format (must be clean)
```bash
pnpm -w run format
```

3) Lint (must be clean)
```bash
pnpm --filter web run lint
```

4) Build (must be clean)
```bash
pnpm --filter cms run build
pnpm --filter web run build
```
Notes:
- `packages/web` build performs data fetching during prerender. A reachable Strapi instance and valid `packages/web/.env.local` are required.

5) Security audit (must be clean)
```bash
pnpm audit --audit-level=low --ignore-unfixable
```

6) Analytics lock + security spot-check (must be clean)
```bash
cd packages/analytics
uv lock --check
uv export --format requirements.txt --no-header --no-annotate > /tmp/pluto-analytics-requirements.txt
uvx pip-audit -r /tmp/pluto-analytics-requirements.txt --no-deps --disable-pip
```

## If Strapi dev fails with native module / ABI errors

You are almost certainly on the wrong Node version or have stale native builds.

```bash
nvm use
pnpm install --force --no-side-effects-cache
pnpm --filter cms run dev
```

If you want streamed logs for the monorepo dev command, use:

```bash
pnpm -r --stream dev
```

(`pnpm -r dev --stream` forwards `--stream` into `strapi develop`, which fails.)
