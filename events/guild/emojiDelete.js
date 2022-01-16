const { Client, MessageEmbed, Message } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "emojiDelete",
  disabled: false,
  /**
   * @param {Client} client
   * @param {guildMember} member
   */
  execute(emoji, client) {
    
    const Log = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("__Emoji Deleted__ 😃")
    .addFields(
        {name: "Name", value: `${emoji.name}`},
        {name: "ID", value: `${emoji.id}`},
        {name: "Author", value: `${emoji.author}`},
        {name: "Animated", value: `${emoji.animated}`},
    )
    .setTimestamp();

    const guild_logs = client.channels.cache
    .get(guild_logs_id)
    .send({ embeds: [Log] });
  },
};
