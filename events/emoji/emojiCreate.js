const { Client, MessageEmbed, Message, Emoji } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "emojiCreate",
  disabled: false,
  /**
   * @param {Client} client
   * @param {Emoji} emoji
   */
  async execute(emoji, client) {

    const guild_logs = emoji.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await emoji.guild.fetchAuditLogs({
      limit: 1,
      type: "EMOJI_CREATE"
    })
    const log = logs.entries.first();

    if(!log) return;

    const emojiCreate = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("Emoji Created 😃")
    .setDescription(`The emoji \`${emoji.name}\` was **created** by \`${log.executor.tag}\` <t:${happen}:R>.`)
    .setImage(emoji.url)
    .setTimestamp();

    guild_logs.send({ embeds: [emojiCreate] });
  },
};
