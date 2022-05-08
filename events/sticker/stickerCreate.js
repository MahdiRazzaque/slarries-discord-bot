const { Client, MessageEmbed, Message, Sticker } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "stickerCreate",
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
      type: "STICKER_CREATE"
    })
    const log = logs.entries.first();

    if(!log) return;

    const stickerCreate = new MessageEmbed()
      .setColor(guild_log_colour)
      .setTitle("Sticker Created 📰")
      .setDescription(`A sticker was **created** by \`${log.executor.tag}\` <t:${happen}:R>.`)
      .addFields(
        { name: "Name", value: `\`${sticker.name}\`` },
        { name: "Tags", value: sticker.tags.map(e => `\`${e}\``).join(" ") },
        { name: "Description", value: sticker.description ? `\`${sticker.description}\`` : "\`No description\`" }
      )
      .setImage(sticker.url)
      .setTimestamp();

      guild_logs.send({ embeds: [stickerCreate] });
  },
};
