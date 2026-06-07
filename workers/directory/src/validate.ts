import type { ListingRequest } from './types'

export type ValidationResult =
  | { ok: true; value: ListingRequest }
  | { ok: false; error: string }

function isPrivateOrLocalHost(hostname: string): boolean {
  const host = hostname.toLowerCase()
  if (host === 'localhost' || host.endsWith('.localhost')) return true
  if (host === '127.0.0.1' || host === '::1') return true
  if (/^10\./.test(host)) return true
  if (/^192\.168\./.test(host)) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true
  return false
}

export function validateListingRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a JSON object.' }
  }

  const raw = body as Record<string, unknown>
  if (raw.type !== 'signalforge-directory-listing-request') {
    return { ok: false, error: 'Invalid listing request type.' }
  }

  const hubId = String(raw.hubId ?? '').trim()
  const publicUrl = String(raw.publicUrl ?? '').trim().replace(/\/+$/, '')
  const name = String(raw.name ?? '').trim()
  const region = String(raw.region ?? '').trim()
  const publicKey = String(raw.publicKey ?? '').trim()
  const contact = String(raw.contact ?? '').trim().toLowerCase()

  if (!hubId.startsWith('hub_')) {
    return { ok: false, error: 'hubId must start with hub_.' }
  }
  if (name.length < 2) {
    return { ok: false, error: 'name is required.' }
  }
  if (region.length < 2) {
    return { ok: false, error: 'region is required.' }
  }
  if (!contact.includes('@') || contact.length < 5) {
    return { ok: false, error: 'contact must be a valid email address.' }
  }
  if (!publicKey.startsWith('ed25519:')) {
    return { ok: false, error: 'publicKey must be an ed25519-prefixed key.' }
  }

  let parsed: URL
  try {
    parsed = new URL(publicUrl)
  } catch {
    return { ok: false, error: 'publicUrl must be a valid URL.' }
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { ok: false, error: 'publicUrl must use http or https.' }
  }
  if (!parsed.hostname || isPrivateOrLocalHost(parsed.hostname)) {
    return { ok: false, error: 'publicUrl must be a public hostname.' }
  }
  if (parsed.username || parsed.password) {
    return { ok: false, error: 'publicUrl must not include credentials.' }
  }

  return {
    ok: true,
    value: {
      type: 'signalforge-directory-listing-request',
      hubId,
      publicUrl,
      name,
      region,
      publicKey,
      contact,
      software: String(raw.software ?? 'SignalForge Hub').trim() || 'SignalForge Hub',
      version: String(raw.version ?? 'unknown').trim() || 'unknown',
    },
  }
}
