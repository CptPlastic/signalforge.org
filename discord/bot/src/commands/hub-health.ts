import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js'
import { BRAND, brandFooter } from '../brand.js'
import { normalizeHubUrl, probeHubHealth } from '../lib/hub-health.js'
import type { BotCommand } from './types.js'

export const hubHealthCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('hub-health')
    .setDescription('Probe a hub public URL (/api/v1/health)')
    .addStringOption((option) =>
      option
        .setName('url')
        .setDescription('Hub base URL, e.g. https://p7hub.projectseven.us')
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })

    const raw = interaction.options.getString('url', true)
    const normalized = normalizeHubUrl(raw)

    if (!normalized) {
      await interaction.editReply('Provide a valid `http://` or `https://` hub URL.')
      return
    }

    const result = await probeHubHealth(normalized)
    const embed = new EmbedBuilder()
      .setColor(result.ok ? BRAND.color : BRAND.colorError)
      .setTitle(result.ok ? '// HUB ONLINE' : '// HUB UNREACHABLE')
      .setDescription(result.detail)
      .addFields({ name: 'URL', value: normalized })
      .setFooter(brandFooter())

    await interaction.editReply({ embeds: [embed] })
  },
}
