const { Client, MessageEmbed, Message, Permissions, GuildScheduledEvent } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "guildScheduledEventCreate",
  disabled: false,
  /**
   * @param {GuildScheduledEvent} role
   * @param {Client} client
   */
  async execute(guildScheduledEvent, client) {

    const guild_logs = guildScheduledEvent.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await guildScheduledEvent.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first();

    if(!log) return;

    if(!log.action == "GUILD_SCHEDULED_EVENT_CREATE") return;
    
    const guildScheduledEventCreate = new MessageEmbed()
      .setColor(guild_log_colour)
      .setTitle("Scheduled Event Created 📅")
      .setDescription(`The scheduled event \`${guildScheduledEvent.name}\` has been **created** by \`${log.executor.tag}\` <t:${happen}:R>.`)
      .addFields(
        { name: "Channel", value: guildScheduledEvent.channelId ? `<#${guildScheduledEvent.channelId}>` : "\`No channel\`" },
        { name: "Description", value: guildScheduledEvent.description ? `\`${guildScheduledEvent.description}\`` : "\`No description\`" },
        { name: "Type", value: `\`${guildScheduledEvent.entityType.toLowerCase().replace("_", " ")}\``, inline: true },
        { name: "Location", value: guildScheduledEvent.entityMetadata != null ? `\`${guildScheduledEvent.entityMetadata.location}\`` : "\`No external location\`", inline: true },
        { name: "Privacy", value: `\`${guildScheduledEvent.privacyLevel.toLowerCase().replace("_", " ")}\``, inline: true },
        { name: "Starts at", value: `<t:${parseInt(guildScheduledEvent.scheduledStartTimestamp / 1000)}:R>`, inline: true },
        { name: "Ends at", value: guildScheduledEvent.scheduledEndTimestamp ? `<t:${parseInt(guildScheduledEvent.scheduledEndTimestamp / 1000)}:R>` : "\`No end\`", inline: true },
        { name: "URL", value: guildScheduledEvent.url }
      )
      .setTimestamp();

    guild_logs.send({ embeds: [guildScheduledEventCreate] });
  },
};
