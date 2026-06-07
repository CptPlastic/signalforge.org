import { buildFeedEntry } from './feedEntry'
import type { ListingRequest, ListingStatus } from './types'

type GitHubIssue = {
  number: number
  html_url: string
  state: 'open' | 'closed'
  labels: Array<{ name: string }>
}

export function buildIssueBody(
  request: ListingRequest,
  health: { ok: boolean; detail: string },
  statusUrl: string,
): string {
  const reviewPayload = JSON.stringify(request, null, 2)
  const feedEntry = JSON.stringify(buildFeedEntry(request), null, 2)
  return [
    '## SignalForge Directory Listing Request',
    '',
    '| Field | Value |',
    '| --- | --- |',
    `| Hub ID | \`${request.hubId}\` |`,
    `| Name | ${request.name} |`,
    `| Public URL | ${request.publicUrl} |`,
    `| Region | ${request.region} |`,
    `| Contact (review only — not in public feed) | ${request.contact} |`,
    `| Software | ${request.software ?? 'SignalForge Hub'} |`,
    `| Version | ${request.version ?? 'unknown'} |`,
    '',
    '### Operator status page',
    statusUrl,
    '',
    '### Health check (at submit time)',
    health.ok ? `- OK — ${health.detail}` : `- FAILED — ${health.detail}`,
    '',
    '### Paste into `directory/hubs.json` → `hubs[]`',
    'This is the **public feed entry** (passes `tools/validate-directory.py`).',
    'Do **not** paste the listing request JSON below into the feed.',
    '',
    '```json',
    feedEntry,
    '```',
    '',
    'After adding the hub, bump top-level `updatedAt` in `directory/hubs.json` to the current unix time.',
    'Promote to `verified` later by updating `directoryStatus`, `trustLevel`, and `trustVerifiedAt`.',
    '',
    '### Listing request JSON (review / audit only)',
    '```json',
    reviewPayload,
    '```',
    '',
    '### Review checklist',
    '- [ ] Public URL serves SignalForge Hub',
    '- [ ] Contact email is reachable (issue only — never publish contact in `hubs.json`)',
    '- [ ] Paste **feed entry** above into `directory/hubs.json`',
    '- [ ] Run `python tools/validate-directory.py`',
    '- [ ] Label `directory-approved` and close when live',
    '- [ ] Or label `directory-rejected` with a reason',
    '',
    '_Submitted via signalforge.org directory worker._',
  ].join('\n')
}

export async function createDirectoryIssue(
  token: string,
  repo: string,
  title: string,
  body: string,
): Promise<GitHubIssue> {
  const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'signalforge-directory-worker',
    },
    body: JSON.stringify({
      title,
      body,
      labels: ['directory-request'],
    }),
  })

  const data = (await response.json()) as GitHubIssue & { message?: string }
  if (!response.ok) {
    throw new Error(data.message ?? `GitHub issue creation failed (${response.status})`)
  }
  return data
}

export async function fetchIssueStatus(
  token: string,
  repo: string,
  issueNumber: number,
): Promise<ListingStatus> {
  const response = await fetch(`https://api.github.com/repos/${repo}/issues/${issueNumber}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'signalforge-directory-worker',
    },
  })
  if (!response.ok) {
    return 'pending'
  }

  const issue = (await response.json()) as GitHubIssue
  const labels = new Set(issue.labels.map((label) => label.name))
  if (issue.state === 'open') return 'pending'
  if (labels.has('directory-approved')) return 'listed'
  if (labels.has('directory-rejected')) return 'rejected'
  return 'closed'
}

export function statusMessage(status: ListingStatus): string {
  switch (status) {
    case 'pending':
      return 'Your listing is in review. We will email you when the status changes.'
    case 'listed':
      return 'Approved and listed. Open your hub console and click CHECK DIRECTORY to pull trust metadata.'
    case 'rejected':
      return 'This listing was not approved. See the GitHub issue for details.'
    default:
      return 'This request is closed. See the GitHub issue for details.'
  }
}
