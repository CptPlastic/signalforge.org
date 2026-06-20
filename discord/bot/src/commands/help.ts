import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js'
import { BRAND, brandFooter, terminalBlock } from '../brand.js'
import { config } from '../config.js'
import type { BotCommand } from './types.js'

export const helpCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('SignalForge operator quick-start'),

  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setColor(BRAND.color)
      .setTitle('// OPERATOR QUICK-START')
      .setDescription(
        terminalBlock('SIGNALFORGE', [
          `Hosted hub → ${config.hostedHubUrl}`,
          `Docs       → ${config.siteUrl}`,
          `Mobile PTT → ${config.siteUrl}/mobile.html`,
          `Directory  → ${config.siteUrl}/register-hub.html`,
          `Feedback   → ${config.siteUrl}/feedback.html`,
        ]),
      )
      .addFields(
        {
          name: '// CHANNELS',
          value:
            '`#hub-setup` Docker & CLI\n`#ptt-mobile` SignalForgeHub app\n`#directory-listing` trust & federation\n`#yukon-traffic` live discussion',
        },
        {
          name: '// COMMANDS',
          value: '`/directory` · `/hub-health` · `/links`',
        },
      )
      .setFooter(brandFooter())

    await interaction.reply({ embeds: [embed], ephemeral: true })
  },
}
