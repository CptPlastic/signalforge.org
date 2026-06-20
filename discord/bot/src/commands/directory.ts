import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js'
import { BRAND, brandFooter } from '../brand.js'
import { config } from '../config.js'
import { fetchDirectory, formatHubLine, searchHubs } from '../lib/directory.js'
import type { BotCommand } from './types.js'

export const directoryCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('directory')
    .setDescription('Search the public SignalForge hub directory')
    .addStringOption((option) =>
      option.setName('query').setDescription('Hub name, region, or URL fragment').setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })

    const query = interaction.options.getString('query') ?? ''

    try {
      const hubs = await fetchDirectory(config.directoryFeedUrl)
      const matches = searchHubs(hubs, query).slice(0, 10)

      const embed = new EmbedBuilder()
        .setColor(BRAND.color)
        .setTitle('// DIRECTORY')
        .setFooter(brandFooter())

      if (matches.length === 0) {
        embed.setDescription(
          query
            ? `No hubs matched \`${query}\`. Try a shorter fragment or browse ${config.siteUrl}/directory/hubs.json`
            : 'The directory feed returned no hubs.',
        )
      } else {
        embed.setDescription(matches.map(formatHubLine).join('\n\n'))
        if (query) {
          embed.setDescription(`Query: \`${query}\`\n\n${embed.data.description}`)
        }
      }

      await interaction.editReply({ embeds: [embed] })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'request failed'
      await interaction.editReply({
        content: `Could not load directory feed: ${message}`,
      })
    }
  },
}
