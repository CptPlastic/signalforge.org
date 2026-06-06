# SignalForge brand system

Retro terminal aesthetic: **amber phosphor on black glass**. Monospace type, ASCII borders, minimal chrome.

## Product identities

SignalForge ships as related but distinct surfaces. Same mast mark, different accent hue.

| Surface | Role | Accent | Icon |
|---------|------|--------|------|
| **Marketing site** | signalforge.org | `#ffc700` | `icon.svg` / `LOGO.svg` |
| **Mobile app** | iOS / Android native | `#ffc700` | `signalforge-mobile/assets/source-icon.svg` |
| **Hub console (PWA)** | Browser desktop / mobile shell | `#ffaa00` | `p7-scanner/client/public/pwa/icon.svg` |

The hub uses a **warmer amber** so operators can tell the PWA from the native app at a glance. Structure (mast, arcs, base) stays identical.

## Core palette

```css
/* Shared neutrals — all surfaces */
--bg:          #0a0a0a;   /* CRT black */
--bg2:         #111111;   /* raised panel */
--text:        #c9c9c9;   /* primary copy */
--muted:       #555555;   /* labels, hints */
--border:      #1f1f1f;   /* rules, frames */
--error:       #ff4444;   /* faults, TX keying */

/* Mobile + marketing primary */
--amber:       #ffc700;
--amber-dim:   #997700;   /* dim rules, secondary strokes */
--amber-bright:#ffda47;    /* hover, emphasis, PTT-ready */

/* Hub console primary (PWA only) */
--hub-amber:   #ffaa00;
--hub-dim:     #b37700;
```

### RGBA helpers

| Token | Value | Use |
|-------|-------|-----|
| Accent glow | `rgba(255, 199, 0, 0.12)` | panel highlight |
| Accent border glow | `rgba(255, 199, 0, 0.35)` | focus ring |
| Hub glow | `rgba(255, 170, 0, 0.12)` | PWA panel highlight |

## Display modes

Operator-facing **DARK / NITE / NVG / LIGHT** palettes for field use (SchedKit-style tactical cycle). See **[DISPLAY-MODES.md](./DISPLAY-MODES.md)**.

## Typography

- **Face:** JetBrains Mono (web), system monospace (mobile/PWA)
- **Style:** ALL CAPS for chrome; `letter-spacing: 0.08em–0.15em` on labels
- **Weights:** 400 body, 700 headers / nav brand

## Logo mark (mast)

The mark is a **radio mast** with three beacon arcs, guy wires, and base line.

| Element | Color | Notes |
|---------|-------|-------|
| Mast, arms, base | `#ffffff` | always white on dark field |
| Beacon arcs (mobile / site) | `#ffc700` | signal emission |
| Beacon arcs (hub PWA) | `#ffaa00` | hub variant |
| App icon field | `#0a0a0a` | square; no gradient |

Source vectors:

- Site: `LOGO.svg` (transparent), `icon.svg` (with field)
- Mobile: `../signalforge-mobile/assets/source-icon.svg`
- Hub PWA: `../p7-scanner/client/public/pwa/icon.svg` (rounded field + bottom accent bar)

Regenerate mobile PNGs after SVG edits:

```bash
cd signalforge-mobile && npm run icons:refresh
```

## UI patterns

### Terminal chrome

```
┌─────────────────────────────┐
│  SECTION TITLE              │
├─────────────────────────────┤
│  body copy in --text        │
└─────────────────────────────┘
```

- Section headers: `--amber` (or `--hub-amber` in PWA)
- Borders: `1px solid var(--border)`
- Active / selected: `--amber` border + `rgba(255,199,0,0.10)` fill

### PTT states (mobile + PWA)

| State | Color |
|-------|-------|
| Idle / ready | `--amber-bright` border |
| Recording / TX | `--error` |
| Uploading | `--muted` |

### Dispatch badge

`◎ DISPATCH` uses `--amber-bright` (mobile) — high-visibility without TX red.

## Implementation map

| Repo | Token source | Icons |
|------|--------------|-------|
| `signalforge.org` | `:root` in each `.html` | `icon.svg`, `LOGO.svg` |
| `signalforge-mobile` | `src/theme.ts` | `assets/source-icon*.svg` → PNG |
| `p7-scanner` | `client/tailwind.config.ts` + `index.css` | `client/public/pwa/icon.svg`, `manifest.webmanifest` |

## Do not

- Reintroduce `#00ff41` matrix green as primary (legacy; removed in amber pivot)
- Use cyan (`#3dcfcf`) — old marketing palette, deprecated
- Mix green-tinted surfaces (`#0a0f0a`, `#1f3a26`) — use neutral `#0a0a0a` / `#1f1f1f`
- Put text directly on pure `#ffc700` — use amber for strokes, labels, and accents; body copy stays `#c9c9c9`

## Version

Brand pivot: **2026-06** — amber terminal MVP identity.
