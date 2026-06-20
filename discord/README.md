# SignalForge Discord

Community Discord for hub operators, Yukon live-traffic listeners, and mobile PTT users. Matches the **amber phosphor on CRT black** brand from [BRAND.md](../BRAND.md).

## What’s in this folder

| Path | Purpose |
|------|---------|
| [SERVER.md](./SERVER.md) | Server layout — channels, roles, copy-paste welcome/rules text |
| [bot/](./bot/) | **SignalForge Bot** — slash commands, welcome messages, directory lookup |
| [assets/](./assets/) | Discord-sized icons and banner source |
| [scripts/export-assets.sh](./scripts/export-assets.sh) | Regenerate PNG assets from `icon.svg` |

## Quick start (you, ~30 min)

### 1. Create the Discord server

1. Discord → **Add a Server** → **Create My Own** → **For a club or community**
2. Name: **SignalForge**
3. Upload server icon: `discord/assets/icon-512.png` (run export script first if missing)
4. Follow [SERVER.md](./SERVER.md) for categories, channels, roles, and pinned copy

### 2. Create the bot application

1. [Discord Developer Portal](https://discord.com/developers/applications) → **New Application** → name **SignalForge Bot**
2. **Bot** tab → **Reset Token** → copy token (keep secret)
3. Enable **Message Content Intent** only if you add message-reading features later (not required for MVP)
4. **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot permissions: **Manage Roles**, **Send Messages**, **Embed Links**, **Read Message History**, **Use Slash Commands**
5. Open the generated URL → add bot to your SignalForge server

### 3. Run the bot

```bash
cd discord/bot
cp .env.example .env
# Edit .env — DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID, WELCOME_CHANNEL_ID

npm install
npm run register   # register slash commands to your guild
npm run dev        # local run
```

Production: run `npm run build && npm start` under systemd, Docker, or any always-on host. The bot needs a persistent WebSocket (not Cloudflare Workers).

### 4. Wire the invite link on the site

After creating a permanent invite (`#welcome` → **Create Invite** → never expires):

1. Set `DISCORD_INVITE` in [assets/discord-config.js](../assets/discord-config.js)
2. Nav and community sections pick it up automatically

## Bot commands (MVP)

| Command | Description |
|---------|-------------|
| `/help` | Operator quick-start — docs, hub, directory, feedback |
| `/links` | Curated resource links |
| `/directory [query]` | Search the public `hubs.json` feed |
| `/hub-health <url>` | Probe `{url}/api/v1/health` (same check as directory registration) |

## Environment

See [bot/.env.example](./bot/.env.example). Required:

- `DISCORD_TOKEN` — bot token
- `DISCORD_CLIENT_ID` — application ID
- `DISCORD_GUILD_ID` — your server ID (for guild-scoped command registration)
- `WELCOME_CHANNEL_ID` — `#welcome` channel ID

Optional:

- `DIRECTORY_FEED_URL` — defaults to `https://signalforge.org/directory/hubs.json`
- `HOSTED_HUB_URL` — defaults to `https://p7hub.projectseven.us`

## Brand reminders

- Embed accent color: `#ffc700` (SignalForge amber)
- Footer: `SignalForge · Yukon, OK · Voice in the Storm`
- Channel section labels use `//` prefix like the marketing site (`// START HERE`, `// OPERATORS`)
- Do **not** use legacy matrix green or cyan — see [BRAND.md](../BRAND.md)

## Deploy options

| Host | Notes |
|------|-------|
| **Same VPS as hub** | systemd unit, low overhead |
| **Fly.io / Railway** | `docker build` from `bot/Dockerfile` |
| **Home lab** | `npm start` in tmux — fine for early community size |

Keep the bot token in secrets — never commit `.env`.
