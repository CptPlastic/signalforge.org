import type { ListingRequest } from './types'

/** Public directory feed hub entry — matches tools/validate-directory.py */
export type DirectoryFeedEntry = {
  hubId: string
  name: string
  publicUrl: string
  region: string
  publicKey: string
  directoryStatus: 'listed' | 'verified' | 'unlisted' | 'suspended'
  trustLevel: 'listed' | 'verified' | 'community' | 'trusted' | 'official' | 'suspended'
  trustIssuerHubId: string
  trustCertificate: string
  trustExpiresAt: number
  trustVerifiedAt: number
  lastSeenAt: number
}

export function buildFeedEntry(
  request: Pick<ListingRequest, 'hubId' | 'name' | 'publicUrl' | 'region' | 'publicKey'>,
  options?: {
    directoryStatus?: DirectoryFeedEntry['directoryStatus']
    trustLevel?: DirectoryFeedEntry['trustLevel']
    trustVerifiedAt?: number
  },
): DirectoryFeedEntry {
  return {
    hubId: request.hubId,
    name: request.name,
    publicUrl: request.publicUrl,
    region: request.region,
    publicKey: request.publicKey,
    directoryStatus: options?.directoryStatus ?? 'listed',
    trustLevel: options?.trustLevel ?? 'listed',
    trustIssuerHubId: 'signalforge-directory',
    trustCertificate: '',
    trustExpiresAt: 0,
    trustVerifiedAt: options?.trustVerifiedAt ?? 0,
    lastSeenAt: 0,
  }
}
