const { Client, MessageEmbed, Message } = require("discord.js");
const { message_log_colour, message_logs_id, error_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "messageUpdate",
  disabled: false,
  /**
   *
   * @param {Message} oldMessage
   * @param {Message} newMessage
   * @param {Client} client
   */
  execute(oldMessage, newMessage, client) {
    if(oldMessage.guild === null) return;
    if (oldMessage.author?.bot || oldMessage.author?.bot === undefined || !oldMessage.guild) return;

    if (oldMessage.content === newMessage.content) return;

    const message_logs = oldMessage.guild.channels.cache.get(message_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const Count = 1950;

    const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "");
    const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "");

    const messageUpdate = new MessageEmbed()
      .setColor(message_log_colour)
      .setTitle("Edited message 📘")
      .setDescription(`A [message](${newMessage.url}) by ${newMessage.author} was **edited** in ${newMessage.channel} <t:${happen}:R>.`)
      .addFields(
        { name: "**Original**", value: `${Original}` },
        { name: "**Edited**", value: `${Edited}` }
      )
      .setFooter({text: `ID: ${newMessage.author.id}`})
      .setTimestamp();

    message_logs.send({ embeds: [messageUpdate] });
  }
}
