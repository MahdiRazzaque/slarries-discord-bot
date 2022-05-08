const { Client, MessageEmbed, Message, ThreadChannel } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");
const ms = require("ms");

module.exports = {
  name: "threadUpdate",
  disabled: false,
  /**
   * @param {ThreadChannel} oldThread
   * @param {ThreadChannel} newThread
   * @param {Client} client
   */
  async execute(oldThread, newThread, client) {

    const guild_logs = oldThread.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await oldThread.guild.fetchAuditLogs({
      limit: 1,
      type: "THREAD_UPDATE"
    })
    const log = logs.entries.first();

    if(!log) return;

    if (oldThread.name !== newThread.name) {
        const nameChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Thread Updated 📰")
            .setTimestamp()
            .setDescription(`The name of ${newThread} has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addFields(
                { name: "Old name", value: `\`${oldThread.name}\`` },
                { name: "New name", value: `\`${newThread.name}\`` }
            )

        guild_logs.send({ embeds: [nameChanged] });
    }
    
    if (!oldThread.archived && newThread.archived) {
        const archived = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Thread Updated 📰")
            .setTimestamp()
            .setDescription(`The thread ${oldThread} was **archived** <t:${happen}:R>.`)
        guild_logs.send({ embeds: [archived] });
      } else if (oldThread.archived && !newThread.archived) {
        const unarchived = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Thread Updated 📰")
            .setTimestamp()
            .setDescription(`The thread ${oldThread} was **unarchived** <t:${happen}:R>.`)
        guild_logs.send({ embeds: [unarchived] });
      }

    if (oldThread.autoArchiveDuration !== newThread.autoArchiveDuration) {
        const archiveDurationChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Thread Updated 📰")
            .setTimestamp()
            .setDescription(`The auto-archive duration of ${newThread} was **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addFields(
                { name: "Old auto-archive", value: `\`${ms(oldThread.autoArchiveDuration * 60000)}\`` },
                { name: "New auto-archive", value: `\`${ms(newThread.autoArchiveDuration * 60000)}\`` }
            )
        guild_logs.send({ embeds: [archiveDurationChanged] });
    }

    if (oldThread.type !== "GUILD_PUBLIC_THREAD") {
        if (!oldThread.invitable && newThread.invitable) {
            const invitableEnabled = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Thread Updated 📰")
                .setTimestamp()
                .setDescription(`The thread ${oldThread} was made invitable <t:${happen}:R>.`)

            guild_logs.send({ embeds: [invitableEnabled] });
        } else if (oldThread.invitable && !newThread.invitable) {
            const invitableDisabled = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Thread Updated 📰")
                .setTimestamp()
                .setDescription(`The thread ${oldThread} was made uninvitable <t:${happen}:R>.`)

            guild_logs.send({ embeds: [invitableDisabled] });
        }
      }

      if (!oldThread.locked && newThread.locked) {
            const threadLocked = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Thread Updated 📰")
                .setTimestamp()
                .setDescription(`The thread ${oldThread} was locked <t:${happen}:R>.`)

            guild_logs.send({ embeds: [threadLocked] });
      } else if (oldThread.locked && !newThread.locked) {
        const threadUnlocked = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Thread Updated 📰")
            .setTimestamp()
            .setDescription(`The thread ${oldThread} was unlocked <t:${happen}:R>.`)

        guild_logs.send({ embeds: [threadUnlocked] });
      }

      if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
        const cooldownChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Thread Updated 📰")
            .setTimestamp()
            .setDescription(`The cooldown of ${newThread} has been changed by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addFields(
                { name: "Old cooldown", value: oldThread.rateLimitPerUser ? `\`${ms(oldThread.rateLimitPerUser * 1000)}\`` : "\`No cooldown before\`" },
                { name: "New cooldown", value: newThread.rateLimitPerUser ? `\`${ms(newThread.rateLimitPerUser * 1000)}\`` : "\`No new cooldown\`" }
            )

        guild_logs.send({ embeds: [cooldownChanged] });
      }
  },
};
