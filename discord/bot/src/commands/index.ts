import { directoryCommand } from './directory.js'
import { helpCommand } from './help.js'
import { hubHealthCommand } from './hub-health.js'
import { linksCommand } from './links.js'
import type { BotCommand } from './types.js'

export const commands: BotCommand[] = [
  helpCommand,
  linksCommand,
  directoryCommand,
  hubHealthCommand,
]

export const commandMap = new Map(commands.map((command) => [command.data.name, command]))
