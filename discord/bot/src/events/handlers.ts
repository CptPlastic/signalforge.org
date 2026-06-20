import { ActivityType, Events, type Client } from 'discord.js'
import { BRAND, terminalBlock } from '../brand.js'
import { config } from '../config.js'

export function registerReadyHandler(client: Client) {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}`)
    readyClient.user.setPresence({
      activities: [{ name: '// monitoring console', type: ActivityType.Watching }],
      status: 'online',
    })
  })
}

export function registerInteractionHandler(client: Client) {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const command = (await import('../commands/index.js')).commandMap.get(interaction.commandName)
    if (!command) return

    try {
      await command.execute(interaction)
    } catch (err) {
      console.error(`Command /${interaction.commandName} failed:`, err)
      const reply = { content: 'Command failed — try again or ping @Official.', ephemeral: true }
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply)
      } else {
        await interaction.reply(reply)
      }
    }
  })
}

export function registerWelcomeHandler(client: Client) {
  client.on(Events.GuildMemberAdd, async (member) => {
    if (member.guild.id !== config.guildId) return

    const channel = member.guild.channels.cache.get(config.welcomeChannelId)
    if (!channel || !channel.isTextBased() || channel.isDMBased()) return

    const embed = {
      color: BRAND.color,
      title: '// NEW OPERATOR',
      description: terminalBlock('WELCOME', [
        `Hey ${member.displayName} — read #rules and pick a role in #roles.`,
        `Hosted hub → ${config.hostedHubUrl}`,
        `Docs       → ${config.siteUrl}`,
      ]),
      footer: { text: BRAND.footer, icon_url: BRAND.footerIcon },
    }

    await channel.send({ content: `${member}`, embeds: [embed] })
  })
}
