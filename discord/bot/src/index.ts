import { Client, GatewayIntentBits } from 'discord.js'
import { config } from './config.js'
import {
  registerInteractionHandler,
  registerReadyHandler,
  registerWelcomeHandler,
} from './events/handlers.js'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
})

registerReadyHandler(client)
registerInteractionHandler(client)
registerWelcomeHandler(client)

client.login(config.token).catch((err) => {
  console.error('Login failed:', err)
  process.exit(1)
})
