# SignalForge Discord server template

Copy this layout when standing up the community server. Names and copy follow the terminal aesthetic from [BRAND.md](../BRAND.md).

## Server settings

| Setting | Value |
|---------|-------|
| **Name** | SignalForge |
| **Icon** | `assets/icon-512.png` (512×512, `#0a0a0a` field + mast mark) |
| **Banner** | `assets/banner.svg` → export 960×540 if your Nitro tier allows banners |
| **Description** | Community-powered radio monitoring — hubs, PTT, directory. Voice in the Storm. |
| **Default notifications** | Only @mentions |
| **Verification level** | Medium (verified email) |
| **Explicit media filter** | Scan media from all members |
| **System messages channel** | `#welcome` |
| **Rules screening** | Enable — paste rules below |
| **Community** | Enable when ready (unlocks welcome screen + discovery perks) |

## Role hierarchy (top → bottom)

Create roles in this order. Colors are Discord role colors (hex).

| Role | Color | Who gets it |
|------|-------|-------------|
| **Official** | `#ffc700` | projectseven / SignalForge team |
| **Hub Host** | `#ffaa00` | Operators running a listed or verified hub |
| **Operator** | `#ffda47` | Active hub users, recorder contributors |
| **Contributor** | `#997700` | Docs/code contributors |
| **@everyone** | default | New members |

Bot role (**SignalForge Bot**) should sit below **Official** but above **Hub Host** if it assigns roles later.

### Permission notes

- `#announcements`, `#platform-updates` — **Official** can post; everyone read-only
- `#rules` — read-only for @everyone
- `#welcome` — bot can post; members read-only
- Voice channels — **Operator**+ can speak by default; `@everyone` can listen

## Categories & channels

Use category names with the `//` prefix to match site section labels.

### // START HERE

| Channel | Type | Purpose |
|---------|------|---------|
| `#welcome` | text | Join messages (bot), pinned intro |
| `#rules` | text | Community rules (read-only) |
| `#roles` | text | Self-assign Operator / Listener (reaction roles or `/roles` later) |
| `#announcements` | text | Releases, directory updates, Yukon network news |

### // OPERATORS

| Channel | Type | Purpose |
|---------|------|---------|
| `#hub-setup` | text | Docker, Compose, CLI recorder, first hub boot |
| `#off-grid-cells` | text | Closed cells, password onboarding, retention |
| `#ptt-mobile` | text | SignalForgeHub app, TX/dispatch, hub account flags |
| `#directory-listing` | text | Register hub, trust levels, federation invites |

### // LIVE

| Channel | Type | Purpose |
|---------|------|---------|
| `#yukon-traffic` | text | Yukon / OKC live monitoring discussion |
| `#general-ops` | text | General operator chat, non-region-specific |

### // DEV & FEEDBACK

| Channel | Type | Purpose |
|---------|------|---------|
| `#platform-updates` | text | Read-only — link GitHub releases & roadmap |
| `#bug-reports` | text | Repro steps; point to [feedback.html](https://signalforge.org/feedback.html) for tickets |
| `#feature-ideas` | text | Feature discussion before GitHub issues |

### // VOICE

| Channel | Type | Purpose |
|---------|------|---------|
| **Ops Floor** | voice | Casual operator hangout |
| **Dispatch** | voice | Optional — mobile PTT coordination (moderated) |

## Pinned copy

### `#welcome` — pin this

```
┌─────────────────────────────────────┐
│  WELCOME TO SIGNALFORGE             │
├─────────────────────────────────────┤
│  Community radio monitoring for     │
│  Yukon, Oklahoma and beyond.        │
│                                     │
│  ◎ Hosted hub → p7hub.projectseven.us
│  ◎ Docs       → signalforge.org
│  ◎ Mobile PTT → signalforge.org/mobile.html
│  ◎ Directory  → signalforge.org/register-hub.html
└─────────────────────────────────────┘

Read #rules, pick roles in #roles, then say hi in #general-ops.

Voice in the Storm.
```

### `#rules` — Community rules

```
// RULES

1. Be practical, respectful, and safety-minded. This is operator-owned infrastructure — not a stunt stream.

2. No posting of private radio credentials, hub admin passwords, magic links, or session tokens.

3. Do not share live addresses, plate numbers, or other doxxing content from scanner traffic.

4. Hub hosts own their cells. Don't pressure operators to open private or off-grid hubs.

5. Bug reports with repro steps go in #bug-reports or signalforge.org/feedback.html for a tracked ticket.

6. Directory listing and federation are opt-in — see #directory-listing and the hub console HUB tab.

7. Official team decisions are final on safety and moderation. Repeated violations → mute/remove.

SignalForge · projectseven co ltd · Yukon, OK
```

### `#roles` — self-assign blurb

```
React to pick your primary role:

🎛️ Operator — I run or use a hub / recorder
📻 Listener — I'm here for live traffic and community
🔧 Contributor — I help with docs, code, or testing

Hub hosts with a listed cell: ping @Official for the Hub Host role after directory approval.
```

(Set up reaction roles manually or extend the bot later.)

## Welcome screen (Community enabled)

| Field | Text |
|-------|------|
| **Description** | Community-powered radio monitoring. Run hubs, join live traffic, test mobile PTT. |
| **Rules** | Link `#rules` |
| **Default channels** | `#welcome`, `#general-ops`, `#announcements` |

## Embed styling (bot + manual posts)

Use these when posting embeds or link previews:

| Token | Value |
|-------|-------|
| Embed color (decimal) | `16761856` (`#ffc700`) |
| Embed color (hex) | `#ffc700` |
| Footer text | `SignalForge · Yukon, OK · Voice in the Storm` |
| Footer icon | `https://signalforge.org/icon.svg` |

Example topic prefixes for `#platform-updates`:

- `// RELEASE` — new hub or mobile build
- `// DIRECTORY` — new listed hub
- `// ROADMAP` — planned platform work

## Permanent invite

Create in `#welcome`:

- Never expires
- No max uses
- Grant access to `// START HERE` channels only initially if using invite roles (optional)

Put the URL in [assets/discord-config.js](../assets/discord-config.js) as `DISCORD_INVITE`.

## Moderation checklist

- [ ] Audit log channel (private, Official-only) — optional `#mod-log`
- [ ] AutoMod: block invite links in `#announcements` except Official
- [ ] Slow mode on `#bug-reports` (30s) to reduce duplicate reports
- [ ] Link `#directory-listing` to [register-hub.html](https://signalforge.org/register-hub.html) in channel topic
