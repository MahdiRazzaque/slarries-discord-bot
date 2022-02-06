const { Client, MessageEmbed, Message, GuildEmoji } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "emojiUpdate",
  disabled: false,
  /**
   * @param {Client} client
   * @param {GuildEmoji} newEmoji
   */
  execute(oldEmoji, newEmoji, client) {

    const guild_logs = client.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const Log = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("__Emoji Updated__ 😃")
    .setDescription(`An emoji's name was **updated** <t:${happen}:R>`)
    .addFields(
        {name: "Old emoji name", value: `\`${oldEmoji.name}\``},
        {name: "New emoji name", value: `\`${newEmoji.name}\``, inline: true},
        {name: "ID", value: `\`${newEmoji.id}\``},
        {name: "Author", value: `\`${newEmoji.author ? newEmoji.author : "Unknown"}\``, inline: true},
        {name: "Animated", value: `\`${newEmoji.animated}\``},
    )
    .setTimestamp();

    guild_logs.send({ embeds: [Log] });
  },
};
