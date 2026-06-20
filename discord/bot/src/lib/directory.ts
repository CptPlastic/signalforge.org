export type DirectoryHub = {
  hubId: string
  name: string
  publicUrl: string
  region?: string
  directoryStatus?: string
  trustLevel?: string
}

export type DirectoryFeed = {
  hubs: DirectoryHub[]
}

export async function fetchDirectory(feedUrl: string): Promise<DirectoryHub[]> {
  const response = await fetch(feedUrl, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`Directory feed returned HTTP ${response.status}`)
  }
  const data = (await response.json()) as DirectoryFeed
  return Array.isArray(data.hubs) ? data.hubs : []
}

export function searchHubs(hubs: DirectoryHub[], query: string): DirectoryHub[] {
  const q = query.trim().toLowerCase()
  if (!q) return hubs
  return hubs.filter((hub) => {
    const haystack = [hub.name, hub.publicUrl, hub.region, hub.trustLevel, hub.directoryStatus]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function formatHubLine(hub: DirectoryHub): string {
  const trust = hub.trustLevel || 'community'
  const status = hub.directoryStatus || 'unlisted'
  const region = hub.region ? ` · ${hub.region}` : ''
  return `**${hub.name}** — \`${trust}\` / \`${status}\`${region}\n${hub.publicUrl}`
}
