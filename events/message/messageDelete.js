const { Client, MessageEmbed, Message } = require("discord.js");
const { message_log_colour, message_logs_id, messageDelete_logging, error_logs_id } = require("../../structures/config.json");
const { blacklistedWords } = require("../../structures/blacklistedWords")

module.exports = {
  name: "messageDelete",
  /**
   * @param {Message} message
   */
  execute(message, client) {
    if (!messageDelete_logging) return;

    try {
      if (message.author.bot) return;

      for (var i = 0; i < blacklistedWords.length; i++) {
        if (message.content.toLowerCase().includes(blacklistedWords[i])) return;
      }

      const Log = new MessageEmbed()
        .setColor(message_log_colour)
        .setTitle("__Deleted message 📕__")
        .setDescription(
          `[message](${message.url}) by ${message.author} was **deleted** in ${message.channel}.`
        )
        .addFields({
          name: "**Deleted message**",
          value: `${message.content ? message.content : "None"}`,
        })
        .setFooter({text: `Member: ${message.author.tag} | ID: ${message.author.id}`})
        .setTimestamp();

      if (message.attachments.size >= 1) {
        Log.addField(
          `**Attachments**`,
          `${message.attachments.map((a) => a.url)}`,
          true
        );
      }

      const message_logs = client.channels.cache
        .get(message_logs_id)
        .send({ embeds: [Log] });
      
    } catch (e) {
      const error_logs = client.channels.cache.get(error_logs_id).send({ embeds: [new MessageEmbed().setColor("RED").setTitle("<a:animated_cross:925091847905366096> messageDelete event").setDescription(`${e}`).setFooter({text: "This error was caught to prevent the bot from crashing."})]}); 
    }
    
  },
};

