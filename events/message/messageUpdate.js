const { Client, MessageEmbed, Message } = require("discord.js");
const { message_log_colour, message_logs_id, messageUpdate_logging, error_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "messageUpdate",
  /**
   *
   * @param {Message} oldMessage
   * @param {Message} newMessage
   * @param {Client} client
   */
  execute(oldMessage, newMessage, client) {
    if (!messageUpdate_logging) return;

    try {
    
      if (oldMessage.author.bot) return;

      if (oldMessage.content === newMessage.content) return;

      const Count = 1950;

      const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "");
      const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "");

      const Log = new MessageEmbed()
        .setColor(message_log_colour)
        .setTitle("__Edited message 📘__")
        .setDescription(`[Message](${newMessage.url}) by ${newMessage.author} was **edited** in ${newMessage.channel}.`)
        .addFields(
          { name: "**Original**", value: `${Original}` },
          { name: "**Edited**", value: `${Edited}` }
        )
        .setFooter(`Member: ${newMessage.author.tag} | ID: ${newMessage.author.id}`)
        .setTimestamp();

      const message_logs = client.channels.cache.get(message_logs_id).send({ embeds: [Log] });
        
    } catch (e) { 
      const error_logs = client.channels.cache.get(error_logs_id).send({ embeds: [new MessageEmbed().setColor("RED").setTitle("<a:animated_cross:925091847905366096> messageUpdate event").setDescription(`${e}`)]});
    }
    
},
};
