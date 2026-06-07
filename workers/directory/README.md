# SignalForge Directory Worker

Cloudflare Worker for one-click hub directory registration:

- `POST /v1/submit` — validate listing, probe hub health, open a GitHub issue, store tracking token, send receipt email
- `GET /v1/listings/:token` — public listing status (synced from GitHub issue labels)
- `GET /v1/health` — worker health

Public site routes:

- Submit form: `https://signalforge.org/register-hub.html`
- Status tracker: `https://signalforge.org/listing.html?token=…`
- API host: `https://signalforge-directory.jason-johnson-633.workers.dev` (see `assets/directory-api.js`)
- Optional pretty URL: CNAME `directory.signalforge.org` → that `workers.dev` host (DNS stays wherever you manage it)

## Prerequisites

1. Cloudflare account with `signalforge.org` zone
2. GitHub fine-grained or classic token with `issues: write` on `CptPlastic/signalforge.org`
3. KV namespace for listing records
4. Cloudflare Email Sending enabled for `signalforge.org` (for receipt emails)

### GitHub labels

Create these labels on `signalforge.org`:

| Label | Color | Meaning |
| --- | --- | --- |
| `directory-request` | `#FBCA04` | Auto-applied on submit |
| `directory-approved` | `#0E8A16` | Close issue after hub is in `hubs.json` |
| `directory-rejected` | `#D93F0B` | Listing declined |

Status mapping on `GET /v1/listings/:token`:

- Issue **open** → `pending`
- Issue **closed** + `directory-approved` → `listed`
- Issue **closed** + `directory-rejected` → `rejected`

## Setup

**One command** (after `npx wrangler login`):

```bash
cd workers/directory
bash scripts/setup.sh
```

That script: checks `GITHUB_TOKEN` secret, enables email sending, creates GitHub labels, deploys the worker with `directory.signalforge.org`.

Manual steps if you prefer:

```bash
cd workers/directory
npm install
npx wrangler secret put GITHUB_TOKEN
npx wrangler email sending enable signalforge.org
bash scripts/setup-github-labels.sh
npm run deploy
```

`wrangler.jsonc` already includes the KV binding and `directory.signalforge.org` custom domain route.

## Local dev

```bash
npm run dev
# POST http://127.0.0.1:8787/v1/submit
```

Set `GITHUB_TOKEN` in `.dev.vars` for local testing:

```
GITHUB_TOKEN=ghp_...
```

## Environment

| Variable | Source | Description |
| --- | --- | --- |
| `GITHUB_TOKEN` | secret | Creates and reads listing issues |
| `GITHUB_REPO` | var | Default `CptPlastic/signalforge.org` |
| `PUBLIC_SITE_ORIGIN` | var | Default `https://signalforge.org` |
| `MAIL_FROM` | var | Default `directory@signalforge.org` |
| `MAIL_FROM_NAME` | var | Default `SignalForge Directory` |
| `LISTINGS` | KV binding | Listing + rate-limit storage |
| `EMAIL` | send_email binding | Receipt mail |

## Review workflow (today)

1. Operator submits from hub console → registration form → **Submit to Directory**
2. Worker opens a GitHub issue labeled `directory-request`
3. You review, merge a PR to `directory/hubs.json`
4. Label issue `directory-approved` and close
5. Operator refreshes status page and runs **CHECK DIRECTORY** in their hub

Phase 2: GitHub Action to open the `hubs.json` PR automatically from approved issues.
