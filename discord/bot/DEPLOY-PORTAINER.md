# Deploy SignalForge Discord bot — Portainer

Run the bot on your server. No inbound ports — only outbound HTTPS to Discord.

## Same stack as the hub (recommended)

If the hub already runs in Portainer (`docker-compose.plesk.yml`), **add the bot there** — no second stack.

1. **Portainer → your hub stack → Editor** (or pull latest `p7-scanner` if the stack deploys from git)
2. Add these **Environment variables**:

   | Name | Value |
   |------|-------|
   | `COMPOSE_PROFILES` | `discord` |
   | `DISCORD_TOKEN` | bot token |
   | `DISCORD_CLIENT_ID` | application ID |
   | `DISCORD_GUILD_ID` | server ID |
   | `WELCOME_CHANNEL_ID` | `#welcome` channel ID |

   Optional: `HOSTED_HUB_URL` → your hub URL (e.g. `https://p7hub.projectseven.us`)

3. **Update the stack** — Portainer rebuilds `discord-bot` from `deploy/discord-bot/` in the hub repo

4. **Register slash commands (once)** on the server:

   ```bash
   cd /path/to/p7-scanner
   COMPOSE_PROFILES=discord-register docker compose -f docker-compose.plesk.yml run --rm discord-register
   ```

5. Test `/help` in Discord

The bot does not depend on postgres/api — it only shares the stack and env file.

---

## Standalone stack (optional)

If you do **not** run a hub on this host, use `discord/bot/docker-compose.yml` in this repo instead.

## Standalone Portainer details

- Portainer on your server
- Bot created in [Discord Developer Portal](https://discord.com/developers/applications) and added to your SignalForge server
- These values ready:
  - `DISCORD_TOKEN` — Bot → Reset Token
  - `DISCORD_CLIENT_ID` — General Information → Application ID
  - `DISCORD_GUILD_ID` — right-click server → Copy Server ID (Developer Mode on)
  - `WELCOME_CHANNEL_ID` — right-click `#welcome` → Copy Channel ID

## Option A — Portainer stack from Git (recommended)

1. **Stacks → Add stack** → name: `signalforge-discord-bot`
2. **Build method:** Repository  
   - Repository URL: your `signalforge.org` git remote  
   - Compose path: `discord/bot/docker-compose.yml`  
   - **Authentication** if private repo
3. **Environment variables** — add:

   | Name | Value |
   |------|-------|
   | `DISCORD_TOKEN` | bot token |
   | `DISCORD_CLIENT_ID` | application ID |
   | `DISCORD_GUILD_ID` | server ID |
   | `WELCOME_CHANNEL_ID` | `#welcome` channel ID |

   Optional: `DIRECTORY_FEED_URL`, `HOSTED_HUB_URL`, `SITE_URL` (defaults are production SignalForge URLs).

4. **Deploy the stack** — Portainer builds the image and starts `bot`.

5. **Register slash commands (once)** — after the bot container is healthy:

   **Portainer UI:** Stacks → `signalforge-discord-bot` → open the stack editor or use **Exec** on a one-off container:

   ```bash
   docker compose --profile register run --rm register
   ```

   Run that from the host in the stack directory, or in Portainer **Containers → Add container** with the same image and command `node dist/register-commands.js`, same env vars, then remove the container.

   Easiest one-liner on the server (from repo checkout):

   ```bash
   cd /path/to/signalforge.org/discord/bot
   docker compose --profile register run --rm register
   ```

6. In Discord, type `/help` — commands should appear within a few seconds.

## Option B — Portainer stack from Web editor

1. Clone or upload `signalforge.org` to the server
2. **Stacks → Add stack** → **Web editor**
3. Paste contents of `discord/bot/docker-compose.yml`
4. Set **Compose path** / working directory to `discord/bot` (or adjust `build.context` if needed)
5. Add environment variables as in Option A
6. Deploy + run register once (step 5 above)

## Option C — Pre-built image (no build on server)

Build locally or in CI, push to GHCR, then change compose to:

```yaml
services:
  bot:
    image: ghcr.io/your-org/signalforge-discord-bot:latest
    # remove build: section
```

Portainer only pulls and runs — no Node build on the VPS.

## Updates

After pulling new bot code:

1. **Stacks → signalforge-discord-bot → Pull and redeploy** (or **Update** with rebuild)
2. Re-run `register` only if slash commands changed

`Restart` is enough for env-only changes if the stack was recreated with new vars.

## Verify

| Check | Expected |
|-------|----------|
| Container status | `running`, restart policy `unless-stopped` |
| Logs | `Logged in as SignalForge Bot#…` |
| Discord | `/help`, `/links`, `/directory`, `/hub-health` work |
| Join test | New member gets welcome embed in `#welcome` |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Stack fails to create | Missing env var — Portainer needs all four required vars |
| Bot offline in Discord | Check logs; token revoked? recreate token and update stack |
| Slash commands missing | Run `register` profile once |
| Welcome not posting | Wrong `WELCOME_CHANNEL_ID`; bot needs **View Channel** + **Send Messages** in `#welcome` |
| Two bots fighting | Stop laptop `npm run dev` — one token, one instance |

## Security

- Never commit `.env` — use Portainer env vars or a server-side `.env` outside git
- Bot token in Portainer is fine; restrict Portainer admin access
- No volumes or exposed ports needed for MVP
