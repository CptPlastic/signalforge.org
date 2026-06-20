export type ListingRequest = {
  type: 'signalforge-directory-listing-request'
  hubId: string
  publicUrl: string
  name: string
  region: string
  publicKey: string
  contact: string
  software?: string
  version?: string
}

export type ListingRecord = {
  token: string
  hubId: string
  name: string
  publicUrl: string
  region: string
  contact: string
  publicKey: string
  version: string
  issueNumber: number
  issueUrl: string
  healthOk: boolean
  healthDetail: string
  createdAt: string
  submitterIp?: string
}

export type ListingStatus = 'pending' | 'listed' | 'rejected' | 'closed'

export type ListingPublicView = {
  token: string
  hubId: string
  name: string
  publicUrl: string
  region: string
  status: ListingStatus
  issueNumber: number
  issueUrl: string
  healthOk: boolean
  healthDetail: string
  createdAt: string
  statusMessage: string
}

export type Env = {
  LISTINGS: KVNamespace
  EMAIL?: SendEmail
  GITHUB_TOKEN: string
  GITHUB_REPO: string
  PUBLIC_SITE_ORIGIN: string
  MAIL_FROM: string
  MAIL_FROM_NAME: string
  PORTAL_INBOUND_SECRET?: string
  SCHEDKIT_URL?: string
  PORTAL_ORG_SLUG?: string
}
