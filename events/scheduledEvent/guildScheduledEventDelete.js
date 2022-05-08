const { Client, MessageEmbed, Message, Permissions, GuildScheduledEvent } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "guildScheduledEventDelete",
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

    if(!log.action == "GUILD_SCHEDULED_EVENT_DELETE") return;
    
    const guildScheduledEventDelete = new MessageEmbed()
      .setColor(guild_log_colour)
      .setTitle("Scheduled Event Deleted 📅")
      .setDescription(`The scheduled event \`${guildScheduledEvent.name || "No old channel"}\` has been **deleted** by \`${log.executor.tag}\` <t:${happen}:R>.`)
      .addFields(
        { name: "Channel", value: guildScheduledEvent.channelId ? `<#${guildScheduledEvent.channelId}>` : "\`No channel\`" },
      )
      .setTimestamp();

    guild_logs.send({ embeds: [guildScheduledEventDelete] });
  },
};
