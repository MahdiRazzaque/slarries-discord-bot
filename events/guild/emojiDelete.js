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

    const guild_logs = client.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)
    
    const Log = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("__Emoji Deleted__ 😃")
    .setDescription(`An emoji was **deleted** <t:${happen}:R>`)
    .addFields(
        {name: "Name", value: `\`${emoji.name}\``},
        {name: "ID", value: `\`${emoji.id}\``, inline: true},
        {name: "Author", value: `\`${emoji.author}\``},
        {name: "Animated", value: `\`${emoji.animated}\``, inline: true},
    )
    .setTimestamp();

    guild_logs.send({ embeds: [Log] });
  },
};
