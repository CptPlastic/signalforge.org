#!/usr/bin/env bash
# One-time / refresh setup for the SignalForge directory worker.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> signalforge directory worker setup"
echo "    working directory: $ROOT"

if ! command -v npx >/dev/null 2>&1; then
  echo "Node.js + npm required."
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "==> npm install"
  npm install
fi

if ! npx wrangler whoami >/dev/null 2>&1; then
  echo "==> Log in to Cloudflare"
  npx wrangler login
fi

if ! grep -q '"id": "efb6e5d9bd1b4bacb5427f5c0471fd0e"' wrangler.jsonc; then
  echo "WARN: KV namespace id missing in wrangler.jsonc."
  echo "     Run: npx wrangler kv namespace create LISTINGS"
  echo "     Then paste the id into wrangler.jsonc kv_namespaces[0].id"
fi

if ! npx wrangler secret list 2>/dev/null | grep -q PORTAL_INBOUND_SECRET; then
  echo "==> Set SchedKit inbound secret (same as projectseven.us / SchedKit container)"
  npx wrangler secret put PORTAL_INBOUND_SECRET
else
  echo "OK: PORTAL_INBOUND_SECRET secret present"
fi

if ! npx wrangler secret list 2>/dev/null | grep -q GITHUB_TOKEN; then
  echo "==> Set GitHub token (issues:write on CptPlastic/signalforge.org)"
  npx wrangler secret put GITHUB_TOKEN
else
  echo "OK: GITHUB_TOKEN secret present"
fi

echo "==> Enable email sending for signalforge.org (safe to re-run)"
npx wrangler email sending enable signalforge.org || true

echo "==> Create GitHub labels"
bash scripts/setup-github-labels.sh

echo "==> Deploy worker (directory.signalforge.org custom domain)"
npm run deploy

echo ""
echo "==> Verify"
echo "curl -s https://directory.signalforge.org/v1/health"
echo ""
echo "Then test: https://signalforge.org/register-hub.html"
echo "Feedback: https://signalforge.org/feedback.html"
