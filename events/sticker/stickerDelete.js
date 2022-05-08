const { Client, MessageEmbed, Message, Sticker } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "stickerDelete",
  disabled: false,
  /**
   * @param {Sticker} sticker
   * @param {Client} client
   */
  async execute(sticker, client) {

    const guild_logs = sticker.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await sticker.guild.fetchAuditLogs({
      limit: 1,
      type: "STICKER_DELETE"
    })
    const log = logs.entries.first();

    if(!log) return;

    const stickerDelete = new MessageEmbed()
      .setColor(guild_log_colour)
      .setTitle("Sticker Created 📰")
      .setDescription(`A sticker was **deleted** by \`${log.executor.tag}\` <t:${happen}:R>.`)
      .addFields(
        { name: "Name", value: `\`${sticker.name}\`` },
      )
      .setTimestamp();

      guild_logs.send({ embeds: [stickerDelete] });
  },
};
