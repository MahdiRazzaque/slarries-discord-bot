const { Client, MessageEmbed, Message } = require("discord.js");
const { message_log_colour, message_logs_id, error_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "messageDelete",
  disabled: false,
  /**
   * @param {Message} message
   */
  async execute(message, client) {

    if(message.guild === null) return;
    if (message.author?.bot || message.author?.bot === undefined) return;

    //Ignoring log is it triggered filter
    const Filter = client.filters.get(message.guild.id);

    for (var i = 0; i < Filter.length; i++) {
      if (message.content.toLowerCase().includes(Filter[i])) return;
    }

    const message_logs = message.guild.channels.cache.get(message_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await message.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first();

    if(!log) return;

    const messageContent = message.content.slice(0, 1000) + (message.content.length > 1000 ? " ..." : "");

    const messageDelete = new MessageEmbed()
      .setColor(message_log_colour)
      .setTitle("Deleted message 📕")
      .setDescription(`[message](${message.url}) by ${message.author} was **deleted** in ${message.channel} <t:${happen}:R>.`)
      .addFields({ name: "**Deleted message**", value: `${messageContent ? messageContent : "None"}` })
      .setFooter({text: `ID: ${message.author.id}`})
      .setTimestamp();

      if (message.attachments.size >= 1) {
        messageDelete.addField(`Attachments`, `${message.attachments.map((image) => `[Image](${image.url})`).join(", ")}`)
      }

      if (log.action == "MESSAGE_DELETE") {
        messageDelete.setDescription(`A [message](${message.url}) by ${message.member} in ${message.channel} was deleted by \`${log.executor.tag}\` <t:${happen}:R>.`)
        message_logs.send({ embeds: [messageDelete] });
      } else { 
        messageDelete.setDescription(`A [message](${message.url}) by ${message.member} in <#${message.channelId}> was deleted by themselves <t:${happen}:R>.`)
        message_logs.send({ embeds: [messageDelete] });
      }
  },
};

