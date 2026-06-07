import type { ListingRecord } from './types'

export async function sendReceiptEmail(
  email: SendEmail | undefined,
  from: { address: string; name: string },
  listing: ListingRecord,
  statusUrl: string,
  issueUrl: string,
): Promise<boolean> {
  if (!email) return false

  const subject = `SignalForge directory request received — ${listing.name}`
  const text = [
    `Hi,`,
    ``,
    `We received your SignalForge hub directory listing request.`,
    ``,
    `Hub: ${listing.name}`,
    `Hub ID: ${listing.hubId}`,
    `Region: ${listing.region}`,
    `Public URL: ${listing.publicUrl}`,
    `GitHub issue: ${issueUrl}`,
    `Track status: ${statusUrl}`,
    ``,
    `We review requests manually. When your hub is added to the directory feed,`,
    `open your hub admin console and click CHECK DIRECTORY.`,
    ``,
    `— SignalForge Directory`,
  ].join('\n')

  const html = [
    `<p>We received your SignalForge hub directory listing request.</p>`,
    `<ul>`,
    `<li><strong>Hub:</strong> ${escapeHtml(listing.name)}</li>`,
    `<li><strong>Hub ID:</strong> <code>${escapeHtml(listing.hubId)}</code></li>`,
    `<li><strong>Region:</strong> ${escapeHtml(listing.region)}</li>`,
    `<li><strong>Public URL:</strong> <a href="${escapeHtml(listing.publicUrl)}">${escapeHtml(listing.publicUrl)}</a></li>`,
    `</ul>`,
    `<p><a href="${escapeHtml(statusUrl)}">Track your listing status</a></p>`,
    `<p><a href="${escapeHtml(issueUrl)}">View review issue #${listing.issueNumber}</a></p>`,
    `<p>When your hub is listed, open your hub console and click <strong>CHECK DIRECTORY</strong>.</p>`,
  ].join('')

  try {
    await email.send({
      to: listing.contact,
      from: { email: from.address, name: from.name },
      replyTo: { email: 'info@projectseven.us', name: 'SignalForge' },
      subject,
      text,
      html,
    })
    return true
  } catch {
    return false
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
