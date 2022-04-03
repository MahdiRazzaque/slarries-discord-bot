const { Client, MessageEmbed, Message, GuildEmoji } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "emojiUpdate",
  disabled: false,
  /**
   * @param {Client} client
   * @param {GuildEmoji} newEmoji
   */
  async execute(oldEmoji, newEmoji, client) {

    const guild_logs = oldEmoji.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await oldEmoji.guild.fetchAuditLogs({
      limit: 1,
      type: "EMOJI_UPDATE"
    })
    const log = logs.entries.first();

    if(!log) return;

    const emojiUpdate = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("Emoji Updated 😃")
    .setDescription(`The emoji's name of \`${newEmoji.name}\` has been updated by \`${log.executor.tag}\` <t:${happen}:R>.`)
    .addFields(
        {name: "Old emoji name", value: `\`${oldEmoji.name}\``},
        {name: "New emoji name", value: `\`${newEmoji.name}\``, inline: true},
    )
    .setTimestamp();

    guild_logs.send({ embeds: [emojiUpdate] });
  },
};
