import 'dotenv/config'

function required(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

export const config = {
  token: required('DISCORD_TOKEN'),
  clientId: required('DISCORD_CLIENT_ID'),
  guildId: required('DISCORD_GUILD_ID'),
  welcomeChannelId: required('WELCOME_CHANNEL_ID'),
  directoryFeedUrl:
    process.env.DIRECTORY_FEED_URL?.trim() || 'https://signalforge.org/directory/hubs.json',
  hostedHubUrl: process.env.HOSTED_HUB_URL?.trim() || 'https://p7hub.projectseven.us',
  siteUrl: process.env.SITE_URL?.trim() || 'https://signalforge.org',
}
