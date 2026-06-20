export const BRAND = {
  name: 'SignalForge',
  tagline: 'Voice in the Storm.',
  color: 0xffc700,
  colorHub: 0xffaa00,
  colorError: 0xff4444,
  colorMuted: 0x555555,
  footer: 'SignalForge · Yukon, OK · Voice in the Storm',
  footerIcon: 'https://signalforge.org/icon.svg',
} as const

export function brandFooter() {
  return { text: BRAND.footer, iconURL: BRAND.footerIcon }
}

export function terminalBlock(title: string, lines: string[]): string {
  const inner = lines.join('\n│  ')
  return `\`\`\`\n┌─────────────────────────────────────┐\n│  ${title}\n├─────────────────────────────────────┤\n│  ${inner}\n└─────────────────────────────────────┘\n\`\`\``
}
