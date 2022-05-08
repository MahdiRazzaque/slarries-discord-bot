const { Client, MessageEmbed, Message, Sticker } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "stickerUpdate",
  disabled: false,
  /**
   * @param {Sticker} oldSticker
   * @param {Sticker} newSticker
   * @param {Client} client
   */
  async execute(oldSticker, newSticker, client) {

    const guild_logs = oldSticker.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await oldSticker.guild.fetchAuditLogs({
      limit: 1,
      type: "STICKER_UPDATE"
    })
    const log = logs.entries.first();

    if(!log) return;

    if (oldSticker.name !== newSticker.name) {
        const nameChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Sticker Updated 📰")
            .setTimestamp()
            .setDescription(`The name of the sticker \`${newSticker.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addFields(
                { name: "Old name", value: `\`${oldSticker.name}\`` },
                { name: "New name", value: `\`${newSticker.name}\`` }
            )
        guild_logs.send({ embeds: [nameChanged] });
    }

    if (oldSticker.description  !== newSticker.description ) {
        const descriptionChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Sticker Updated 📰")
            .setTimestamp()
            .setDescription(`The description of the sticker \`${oldSticker.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addFields(
                { name: "Old description", value: oldSticker.description ? `\`${oldSticker.description}\`` : "No description before" },
                { name: "New description", value: newSticker.description ? `\`${newSticker.description}\`` : "No new description" }
            )
        guild_logs.send({ embeds: [descriptionChanged] });
    }

    if (oldSticker.tags !== newSticker.tags) {
        const tagsChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Sticker Updated 📰")
            .setTimestamp()
            .setDescription(`> The tags of the sticker \`${oldSticker.name}\` has been **updated** by \`${log.executor.tag}\``)
            .addFields(
                { name: "Old tags", value: oldSticker.tags.map(e => `\`${e}\` | :${e}:`).join("  ") },
                { name: "New tags", value: newSticker.tags.map(e => `\`${e}\` | :${e}:`).join("  ") }
            )
          guild_logs.send({ embeds: [tagsChanged] });
      }
  },
};
