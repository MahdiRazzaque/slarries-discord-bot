const { Client, MessageEmbed, Message } = require("discord.js");
const {
  message_log_colour,
  message_logs_id,
  messageDelete_logging,
} = require("../../structures/config");

module.exports = {
  name: "messageDelete",
  /**
   * @param {Message} message
   */
  execute(message, client) {
    if (!messageDelete_logging) return;
    
    if (message.author.bot) return;

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
      .setFooter(`Member: ${message.author.tag} | ID: ${message.author.id}`)
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
  },
};
