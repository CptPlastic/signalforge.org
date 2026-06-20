import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js'
import { BRAND, brandFooter } from '../brand.js'
import { config } from '../config.js'
import type { BotCommand } from './types.js'

const LINKS = [
  { label: 'SignalForge site', url: config.siteUrl },
  { label: 'Hosted hub', url: config.hostedHubUrl },
  { label: 'Join the hub', url: `${config.siteUrl}/join.html` },
  { label: 'Mobile app', url: `${config.siteUrl}/mobile.html` },
  { label: 'Register hub', url: `${config.siteUrl}/register-hub.html` },
  { label: 'Feedback / tickets', url: `${config.siteUrl}/feedback.html` },
  { label: 'Hub source', url: `${config.siteUrl}/source.html` },
  { label: 'Brand guide', url: `${config.siteUrl}/BRAND.md` },
]

export const linksCommand: BotCommand = {
  data: new SlashCommandBuilder().setName('links').setDescription('Curated SignalForge resource links'),

  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setColor(BRAND.color)
      .setTitle('// LINKS')
      .setDescription(LINKS.map((link) => `[${link.label}](${link.url})`).join('\n'))
      .setFooter(brandFooter())

    await interaction.reply({ embeds: [embed], ephemeral: true })
  },
}
