const { Client, MessageEmbed, Message, Permissions, GuildScheduledEvent } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "guildScheduledEventUpdate",
  disabled: false,
  /**
   * @param {GuildScheduledEvent} role
   * @param {Client} client
   */
  async execute(oldGuildScheduledEvent, newGuildScheduledEvent, client) {

    const guild_logs = oldGuildScheduledEvent.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await oldGuildScheduledEvent.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first();

    if(!log) return;

    if (log.action == "GUILD_SCHEDULED_EVENT_UPDATE") {
    
        if (oldGuildScheduledEvent.url !== newGuildScheduledEvent.url) {
            const urlChanged = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Scheduled Event Updated 📅")
                .setTimestamp()
                .setDescription(`The url of \`${oldGuildScheduledEvent.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
                .addFields(
                    { name: "Old url", value: oldGuildScheduledEvent.url },
                    { name: "New url", value: newGuildScheduledEvent.url }
                )
            guild_logs.send({ embeds: [urlChanged] });
        }

        if (oldGuildScheduledEvent.channelId !== newGuildScheduledEvent.channelId) { 
            const channelChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Scheduled Event Updated 📅")
            .setTimestamp()
            .setDescription(`The channel of \`${oldGuildScheduledEvent.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addFields(
                { name: "Old channel", value: oldGuildScheduledEvent.channelId ? `<#${oldGuildScheduledEvent.channelId}>` : "\`No channel before\`" },
                { name: "New channel", value: newGuildScheduledEvent.channelId ? `<#${newGuildScheduledEvent.channelId}>` : "\`No new channel\`" }
            )
            guild_logs.send({ embeds: [channelChanged] });
        }

        if (oldGuildScheduledEvent.description !== newGuildScheduledEvent.description) { 
            const descriptionChanged = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Scheduled Event Updated 📅")
                .setTimestamp()
                .setDescription(`The description of \`${oldGuildScheduledEvent.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
                .addFields(
                    { name: "Old description", value: oldGuildScheduledEvent.description ? `\`${oldGuildScheduledEvent.description}\`` : "\`No description before\`" },
                    { name: "New description", value: newGuildScheduledEvent.description ? `\`${newGuildScheduledEvent.description}\`` : "\`No new description\`" }
                )
            guild_logs.send({ embeds: [guildScheduledEventUpdate] });
        }

        if (oldGuildScheduledEvent.entityMetadata || newGuildScheduledEvent.entityMetadata) { 
            const locationChanged = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Scheduled Event Updated 📅")
                .setTimestamp()
            if (!oldGuildScheduledEvent.entityMetadata && newGuildScheduledEvent.entityMetadata) {
                locationChanged.setDescription(`The location of \`${oldGuildScheduledEvent.name}\` has been added by \`${log.executor.tag}\` <t:${happen}:R>.`)
                locationChanged.addField("New location", newGuildScheduledEvent.entityMetadata.location)
                guild_logs.send({ embeds: [locationChanged] });

            } else if (oldGuildScheduledEvent.entityMetadata && !newGuildScheduledEvent.entityMetadata) {
                locationChanged.setDescription(`The location of \`${oldGuildScheduledEvent.name}\` has been removed by \`${log.executor.tag}\` <t:${happen}:R>.`)
                locationChanged.addField("Old location", oldGuildScheduledEvent.entityMetadata.location)
                guild_logs.send({ embeds: [locationChanged] });

            } else if (oldGuildScheduledEvent.entityMetadata.location !== newGuildScheduledEvent.entityMetadata.location) {
                locationChanged.setDescription(`The location of \`${oldGuildScheduledEvent.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
                locationChanged.addFields(
                    { name: "Old location", value: oldGuildScheduledEvent.entityMetadata.location },
                    { name: "New location", value: newGuildScheduledEvent.entityMetadata.location }
                )
            guild_logs.send({ embeds: [locationChanged] });
            }
        }

        if (oldGuildScheduledEvent.entityType !== newGuildScheduledEvent.entityType ) { 
            const typeChanged = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Scheduled Event Updated 📅")
                .setTimestamp()
                .setDescription(`The type of \`${oldGuildScheduledEvent.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
                .addFields(
                    { name: "Old type", value: `\`${oldGuildScheduledEvent.entityType.toLowerCase().replaceAll("_", " ")}\`` },
                    { name: "New type", value: `\`${newGuildScheduledEvent.entityType.toLowerCase().replaceAll("_", " ")}\`` }
                )
            guild_logs.send({ embeds: [typeChanged] });
        }

        if (oldGuildScheduledEvent.status !== newGuildScheduledEvent.status  ) { 
            const statusChanged = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Scheduled Event Updated 📅")
                .setTimestamp()
                .setDescription(`The status of \`${oldGuildScheduledEvent.name}\` has been **updated** <t:${happen}:R>.`)
                .addFields(
                    { name: "Old status", value: oldGuildScheduledEvent.status ? `\`${oldGuildScheduledEvent.status.toLowerCase()}\`` : "\`No status before\`" },
                    { name: "New status", value: newGuildScheduledEvent.status ? `\`${newGuildScheduledEvent.status.toLowerCase()}\`` : "\`No new status\`" }
                )
            guild_logs.send({ embeds: [statusChanged] });
        }
    } else {
        if (oldGuildScheduledEvent.scheduledStartTimestamp !== newGuildScheduledEvent.scheduledStartTimestamp) {
            const startChanged = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Scheduled Event Updated 📅")
                .setTimestamp()
                .setDescription(`The start of \`${oldGuildScheduledEvent.name}\` has been **updated** <t:${happen}:R>.`)
                .addFields(
                    { name: "Old start", value: `<t:${parseInt(oldGuildScheduledEvent.scheduledStartTimestamp / 1000)}:R>` },
                    { name: "New start", value: `<t:${parseInt(newGuildScheduledEvent.scheduledStartTimestamp / 1000)}:R>` }
                )
    
            guild_logs.send({ embeds: [startChanged] });
        }

        if (oldGuildScheduledEvent.scheduledEndTimestamp !== newGuildScheduledEvent.scheduledEndTimestamp) {
            const endChanged = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Scheduled Event Updated 📅")
                .setTimestamp()
                .setDescription(`The end of \`${oldGuildScheduledEvent.name}\` has been **updated** <t:${happen}:R>.`)
                .addFields(
                    { name: "Old end", value: `<t:${parseInt(oldGuildScheduledEvent.scheduledEndTimestamp / 1000)}:R>` },
                    { name: "New end", value: `<t:${parseInt(newGuildScheduledEvent.scheduledEndTimestamp / 1000)}:R>` }
                )
              guild_logs.send({ embeds: [endChanged] });
        }
    }
  },
};
