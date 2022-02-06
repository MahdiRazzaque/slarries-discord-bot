const { Client, MessageEmbed, Message, Emoji } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "emojiCreate",
  disabled: false,
  /**
   * @param {Client} client
   * @param {Emoji} emoji
   */
  execute(emoji, client) {

    const guild_logs = client.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const Log = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("__Emoji Created__ 😃")
    .setDescription(`An emoji was **created** <t:${happen}:R>`)
    .addFields(
        {name: "Emoji", value: `${emoji}`},
        {name: "Name", value: `\`${emoji.name}\``, inline: true},
        {name: "ID", value: `\`${emoji.id}\``},
        {name: "Author", value: `\`${emoji.author}\``, inline: true},
        {name: "Animated", value: `\`${emoji.animated}\``},
    )
    .setTimestamp();

    guild_logs.send({ embeds: [Log] });
  },
};
