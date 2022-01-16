const { Client, MessageEmbed, Message } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "emojiUpdate",
  disabled: false,
  /**
   * @param {Client} client
   * @param {guildMember} member
   */
  execute(oldEmoji, newEmoji, client) {

    const Log = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("__Emoji Updated__ 😃")
    .addFields(
        {name: "Old emoji name", value: `${oldEmoji.name}`},
        {name: "New emoji name", value: `${newEmoji.name}`},
        {name: "ID", value: `${newEmoji.id}`},
        {name: "Author", value: `${newEmoji.author}`},
        {name: "Animated", value: `${newEmoji.animated}`},
    )
    .setTimestamp();

    const guild_logs = client.channels.cache
    .get(guild_logs_id)
    .send({ embeds: [Log] });
  },
};
