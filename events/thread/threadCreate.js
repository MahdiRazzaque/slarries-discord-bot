const { Client, MessageEmbed, Message, ThreadChannel } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "threadCreate",
  disabled: false,
  /**
   * @param {ThreadChannel} thread
   * @param {Client} client
   */
  async execute(thread, client) {

    const guild_logs = thread.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await thread.guild.fetchAuditLogs({
      limit: 1,
      type: "THREAD_CREATE"
    })
    const log = logs.entries.first();

    if(!log) return;

    const threadCreate = new MessageEmbed()
      .setColor(guild_log_colour)
      .setTitle("Thread Created 📰")
      .setDescription(`A thread \`${thread.name}\` has been **created** by \`${log.executor.tag}\` <t:${happen}:R>.`)
      .addFields(
        { name: "Auto-archive", value: `\`${ms(thread.autoArchiveDuration * 60000)}\`` },
        { name: "Invitable", value: thread.invitable ? "\`Yes\`" : "\`No\`" },
        { name: "Owner", value: `<@!${thread.ownerId}>` },
        { name: "Parent", value: thread.parentId ? `<#${thread.parentId}>` : "\`No parent\`" },
        { name: "Rate limit", value: thread.rateLimitPerUser ? `\`${ms(thread.rateLimitPerUser * 1000)}\`` : "\`No rate limit\`" },
        { name: "Type", value: `\`${thread.type.toLowerCase().replaceAll("_", " ")}\`` }
      )
      .setTimestamp();

      guild_logs.send({ embeds: [threadCreate] });
  },
};
