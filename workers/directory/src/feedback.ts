export type FeedbackRequest = {
  name: string
  email: string
  category: string
  message: string
  hubUrl?: string
  appVersion?: string
  platform?: string
}

const CATEGORIES: Record<string, string> = {
  'mobile-app': 'Mobile app',
  'hub-operator': 'Hub operator',
  directory: 'Directory listing',
  bug: 'Bug report',
  feature: 'Feature request',
  other: 'General feedback',
}

export function validateFeedbackRequest(raw: unknown):
  | { ok: true; value: FeedbackRequest }
  | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'invalid JSON body' }
  }

  const body = raw as Record<string, unknown>
  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  const category = String(body.category ?? 'other').trim().toLowerCase()
  const message = String(body.message ?? '').trim()
  const hubUrl = String(body.hubUrl ?? body.hub_url ?? '').trim()
  const appVersion = String(body.appVersion ?? body.app_version ?? '').trim()
  const platform = String(body.platform ?? '').trim().toLowerCase()

  if (!name || name.length < 2) return { ok: false, error: 'name is required' }
  if (!email.includes('@') || email.length < 5) return { ok: false, error: 'valid email is required' }
  if (!message || message.length < 10) return { ok: false, error: 'message must be at least 10 characters' }
  if (!CATEGORIES[category]) return { ok: false, error: 'invalid category' }

  return {
    ok: true,
    value: {
      name,
      email,
      category,
      message,
      ...(hubUrl ? { hubUrl } : {}),
      ...(appVersion ? { appVersion } : {}),
      ...(platform ? { platform } : {}),
    },
  }
}

export async function submitFeedbackToSchedkit(
  feedback: FeedbackRequest,
  env: { SCHEDKIT_URL?: string; PORTAL_INBOUND_SECRET?: string; PORTAL_ORG_SLUG?: string },
): Promise<{ ok: true; ticketId: string } | { ok: false; error: string; status: number }> {
  const secret = env.PORTAL_INBOUND_SECRET?.trim()
  if (!secret) {
    return { ok: false, error: 'feedback not configured', status: 503 }
  }

  const schedkitUrl = (env.SCHEDKIT_URL || 'https://schedkit.net').replace(/\/$/, '')
  const orgSlug = env.PORTAL_ORG_SLUG || 'projectseven'
  const categoryLabel = CATEGORIES[feedback.category] || 'General feedback'
  const subject = `[SF Feedback] ${categoryLabel} from ${feedback.name}`

  const lines = [
    `Name: ${feedback.name}`,
    `Email: ${feedback.email}`,
    `Category: ${categoryLabel}`,
  ]
  if (feedback.platform) lines.push(`Platform: ${feedback.platform}`)
  if (feedback.appVersion) lines.push(`App version: ${feedback.appVersion}`)
  if (feedback.hubUrl) lines.push(`Hub URL: ${feedback.hubUrl}`)
  lines.push('', feedback.message, '', '---', 'Sent from signalforge.org feedback form')

  const payload = {
    name: feedback.name,
    email: feedback.email,
    subject,
    message: lines.join('\n'),
    source: 'api',
    source_ref: `sf-feedback:${await hashRef(feedback.email, subject, feedback.message.slice(0, 200))}`,
    department_slug: 'technical',
    priority: feedback.category === 'bug' ? 'high' : 'normal',
    org_slug: orgSlug,
  }

  const response = await fetch(`${schedkitUrl}/v1/portal/inbound/ticket`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Portal-Inbound-Secret': secret,
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => ({}))) as { ticket_id?: string; error?: string }
  if (!response.ok || !data.ticket_id) {
    return {
      ok: false,
      error: data.error || 'could not create ticket',
      status: response.status >= 400 ? response.status : 502,
    }
  }

  return { ok: true, ticketId: String(data.ticket_id) }
}

async function hashRef(email: string, subject: string, excerpt: string): Promise<string> {
  const input = `${email}|${subject}|${excerpt}`
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}
