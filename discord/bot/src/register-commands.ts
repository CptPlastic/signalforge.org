import { REST, Routes } from 'discord.js'
import { config } from './config.js'
import { commands } from './commands/index.js'

const rest = new REST({ version: '10' }).setToken(config.token)

async function main() {
  const body = commands.map((command) => command.data.toJSON())

  console.log(`Registering ${body.length} slash command(s) to guild ${config.guildId}…`)

  await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body })

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
