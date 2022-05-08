const { Client, MessageEmbed, Message, ThreadChannel } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "threadDelete",
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
      type: "THREAD_DELETE"
    })
    const log = logs.entries.first();

    if(!log) return;

    const threadDelete = new MessageEmbed()
      .setColor(guild_log_colour)
      .setTitle("Thread Deleted 📰")
      .setDescription(`A thread \`${thread.name}\` has been **deleted** by \`${log.executor.tag}\` <t:${happen}:R>.`)
      .setTimestamp();

      guild_logs.send({ embeds: [threadDelete] });
  },
};
