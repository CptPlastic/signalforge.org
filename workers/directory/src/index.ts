import { sendReceiptEmail } from './email'
import { submitFeedbackToSchedkit, validateFeedbackRequest } from './feedback'
import { buildFeedEntry } from './feedEntry'
import {
  buildIssueBody,
  createDirectoryIssue,
  fetchIssueStatus,
  statusMessage,
} from './github'
import { probeHubHealth } from './health'
import type { Env, ListingPublicView, ListingRecord } from './types'
import { validateListingRequest } from './validate'

const ALLOWED_ORIGINS = new Set([
  'https://signalforge.org',
  'https://www.signalforge.org',
  'http://localhost:8787',
  'http://127.0.0.1:8787',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
])

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request)
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    const url = new URL(request.url)
    try {
      if (request.method === 'GET' && url.pathname === '/v1/health') {
        return json({ ok: true, service: 'signalforge-directory' }, 200, cors)
      }

      if (request.method === 'POST' && url.pathname === '/v1/submit') {
        return await handleSubmit(request, env, cors)
      }

      if (request.method === 'POST' && url.pathname === '/v1/feedback') {
        return await handleFeedback(request, env, cors)
      }

      const listingMatch = url.pathname.match(/^\/v1\/listings\/([a-f0-9]{32})$/)
      if (request.method === 'GET' && listingMatch) {
        return await handleGetListing(listingMatch[1], env, cors)
      }

      return json({ ok: false, error: 'not found' }, 404, cors)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'internal error'
      return json({ ok: false, error: message }, 500, cors)
    }
  },
}

async function handleFeedback(request: Request, env: Env, cors: HeadersInit): Promise<Response> {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
  if (!(await feedbackRateLimitOk(env, ip))) {
    return json({ ok: false, error: 'rate limit exceeded — try again later' }, 429, cors)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: 'invalid JSON body' }, 400, cors)
  }

  const validated = validateFeedbackRequest(body)
  if (!validated.ok) {
    return json({ ok: false, error: validated.error }, 400, cors)
  }

  const result = await submitFeedbackToSchedkit(validated.value, env)
  if (!result.ok) {
    const status = result.status === 403 ? 503 : result.status
    return json({ ok: false, error: result.error }, status, cors)
  }

  return json(
    {
      ok: true,
      ticketId: result.ticketId,
      message: 'Feedback received. We will follow up by email if needed.',
    },
    201,
    cors,
  )
}

async function handleSubmit(request: Request, env: Env, cors: HeadersInit): Promise<Response> {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
  if (!(await rateLimitOk(env, ip))) {
    return json({ ok: false, error: 'rate limit exceeded — try again later' }, 429, cors)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: 'invalid JSON body' }, 400, cors)
  }

  const validated = validateListingRequest(body)
  if (!validated.ok) {
    return json({ ok: false, error: validated.error }, 400, cors)
  }
  const listingRequest = validated.value

  const existing = await env.LISTINGS.get(`hub:${listingRequest.hubId}`)
  if (existing) {
    const prior = JSON.parse(existing) as ListingRecord
    const priorStatus = await fetchIssueStatus(env.GITHUB_TOKEN, env.GITHUB_REPO, prior.issueNumber)
    if (priorStatus === 'pending') {
      return json(
        {
          ok: true,
          alreadySubmitted: true,
          token: prior.token,
          issueNumber: prior.issueNumber,
          issueUrl: prior.issueUrl,
          statusUrl: `${env.PUBLIC_SITE_ORIGIN}/listing.html?token=${prior.token}`,
          emailSent: false,
        },
        200,
        cors,
      )
    }
  }

  const health = await probeHubHealth(listingRequest.publicUrl)
  if (!health.ok) {
    return json({ ok: false, error: health.detail }, 400, cors)
  }

  const token = randomToken()
  const statusUrl = `${env.PUBLIC_SITE_ORIGIN}/listing.html?token=${token}`
  const issueTitle = `[Directory] ${listingRequest.name} (${listingRequest.hubId.slice(0, 12)}…)`
  const issueBody = buildIssueBody(listingRequest, health, statusUrl)

  const issue = await createDirectoryIssue(env.GITHUB_TOKEN, env.GITHUB_REPO, issueTitle, issueBody)
  const record: ListingRecord = {
    token,
    hubId: listingRequest.hubId,
    name: listingRequest.name,
    publicUrl: listingRequest.publicUrl,
    region: listingRequest.region,
    contact: listingRequest.contact,
    publicKey: listingRequest.publicKey,
    version: listingRequest.version ?? 'unknown',
    issueNumber: issue.number,
    issueUrl: issue.html_url,
    healthOk: health.ok,
    healthDetail: health.detail,
    createdAt: new Date().toISOString(),
    submitterIp: ip,
  }

  await env.LISTINGS.put(`listing:${token}`, JSON.stringify(record))
  await env.LISTINGS.put(`hub:${listingRequest.hubId}`, JSON.stringify(record), {
    expirationTtl: 60 * 60 * 24 * 90,
  })

  const emailSent = await sendReceiptEmail(
    env.EMAIL,
    { address: env.MAIL_FROM, name: env.MAIL_FROM_NAME },
    record,
    statusUrl,
    issue.html_url,
  )

  return json(
    {
      ok: true,
      token,
      issueNumber: issue.number,
      issueUrl: issue.html_url,
      statusUrl,
      emailSent,
      feedEntry: buildFeedEntry(listingRequest),
    },
    201,
    cors,
  )
}

async function handleGetListing(token: string, env: Env, cors: HeadersInit): Promise<Response> {
  const raw = await env.LISTINGS.get(`listing:${token}`)
  if (!raw) {
    return json({ ok: false, error: 'listing not found' }, 404, cors)
  }

  const record = JSON.parse(raw) as ListingRecord
  const status = await fetchIssueStatus(env.GITHUB_TOKEN, env.GITHUB_REPO, record.issueNumber)
  const view: ListingPublicView = {
    token: record.token,
    hubId: record.hubId,
    name: record.name,
    publicUrl: record.publicUrl,
    region: record.region,
    status,
    issueNumber: record.issueNumber,
    issueUrl: record.issueUrl,
    healthOk: record.healthOk,
    healthDetail: record.healthDetail,
    createdAt: record.createdAt,
    statusMessage: statusMessage(status),
  }

  return json({ ok: true, listing: view }, 200, cors)
}

async function feedbackRateLimitOk(env: Env, ip: string): Promise<boolean> {
  const hour = new Date().toISOString().slice(0, 13)
  const key = `feedback-rate:${ip}:${hour}`
  const current = Number(await env.LISTINGS.get(key)) || 0
  if (current >= 5) return false
  await env.LISTINGS.put(key, String(current + 1), { expirationTtl: 3600 })
  return true
}

async function rateLimitOk(env: Env, ip: string): Promise<boolean> {
  const hour = new Date().toISOString().slice(0, 13)
  const key = `rate:${ip}:${hour}`
  const current = Number(await env.LISTINGS.get(key)) || 0
  if (current >= 8) return false
  await env.LISTINGS.put(key, String(current + 1), { expirationTtl: 3600 })
  return true
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('Origin') ?? ''
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
  if (ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  return headers
}

function json(payload: unknown, status: number, cors: HeadersInit): Response {
  const headers = new Headers(cors)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  return new Response(JSON.stringify(payload), { status, headers })
}
