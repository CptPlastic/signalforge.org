# SignalForge display modes

Operator display modes for field use — inspired by tactical NVG workflows ([SchedKit display modes](https://schedkit.net/)).

## Modes

| Mode | ID | Purpose |
|------|-----|---------|
| **DARK** | `dark` | Default amber phosphor on CRT black — day/night console |
| **NITE** | `nite` | Dim red phosphor — naked-eye dark adaptation (rhodopsin-safe) |
| **NVG** | `nvg` | Ultra-low luminance blue-grey — Gen III NVG-friendly |
| **LIGHT** | `light` | Daylight / paper terminal — deliberate activation only |

## Tactical cycle

Normal tap cycles **only** the tactical trio — never passes through full brightness:

```
DARK → NITE → NVG → DARK → …
```

**LIGHT** is deliberate but desktop-friendly:

- **Click ☀ LIGHT** in the mode bar to enter daylight mode.
- **Click ☀ LIGHT** again (or any tactical mode) to leave.
- **Long-press DARK** (800 ms) also enters LIGHT on touch devices.

The tactical cycle never auto-passes through LIGHT, so you won't flash-blind NVG or night-adapted eyes mid-op.

## Palettes

### DARK (default)

| Token | Site / mobile | Hub PWA |
|-------|---------------|---------|
| Background | `#0a0a0a` | `#0a0a0a` |
| Surface | `#111111` | `#111111` |
| Text | `#c9c9c9` | `#c9c9c9` |
| Accent | `#ffc700` | `#ffaa00` |
| Emphasis | `#ffda47` | `#ffc700` |

### NITE

| Token | Value |
|-------|-------|
| Background | `#080000` |
| Surface | `#120404` |
| Text | `#8a3030` |
| Accent | `#aa2020` |
| Emphasis | `#cc3333` |

### NVG

| Token | Value |
|-------|-------|
| Background | `#06080a` |
| Surface | `#0a1014` |
| Text | `#5a6a72` |
| Accent | `#4a6878` |
| Emphasis | `#5a7888` |

Luminance is intentionally crushed. No saturated amber or white UI chrome.

### LIGHT

| Token | Value |
|-------|-------|
| Background | `#ece8dc` |
| Surface | `#f8f6f0` |
| Text | `#1a1814` |
| Accent | `#a07800` |
| Emphasis | `#c89600` |

## Persistence

| Surface | Storage key |
|---------|-------------|
| Website | `localStorage.sf-display-mode` |
| Hub PWA | `localStorage.sf-display-mode` |
| Mobile | `AsyncStorage` key `@signalforge/display-mode` |

## Implementation

| Surface | Mechanism |
|---------|-----------|
| Website | `assets/display-modes.css` + `assets/display-modes.js` on `html[data-sf-mode]` |
| Hub PWA | CSS vars on `html[data-sf-display-mode]` + Tailwind `console.*` → `var(--sf-*)` |
| Mobile | `DisplayModeContext` + per-screen themed `StyleSheet` |

## UI chrome

Switcher label format (all surfaces):

```
[◑] DARK  [▌] NITE  [◈] NVG  [☀] LIGHT
```

- Active mode: accent color + underline
- Inactive: muted
- LIGHT tab: click to enter/exit; long-press DARK is an alternate on touch

## Related

- [BRAND.md](./BRAND.md) — logos, amber tokens, product identity
