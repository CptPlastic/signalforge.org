export type HealthProbeResult = {
  ok: boolean
  detail: string
}

export async function probeHubHealth(publicUrl: string): Promise<HealthProbeResult> {
  const base = publicUrl.replace(/\/+$/, '')
  const url = `${base}/api/v1/health`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8_000)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    if (!response.ok) {
      return {
        ok: false,
        detail: `Health check returned HTTP ${response.status} for ${url}`,
      }
    }
    return { ok: true, detail: `${url} responded OK.` }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'request failed'
    return { ok: false, detail: `Could not reach ${url}: ${message}` }
  } finally {
    clearTimeout(timeout)
  }
}

export function normalizeHubUrl(input: string): string | null {
  try {
    const parsed = new URL(input.trim())
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null
    }
    parsed.hash = ''
    parsed.search = ''
    return parsed.toString().replace(/\/+$/, '')
  } catch {
    return null
  }
}
