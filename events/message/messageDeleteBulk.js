const { Client, MessageEmbed, Message } = require("discord.js");
const { message_log_colour, message_logs_id, error_logs_id } = require("../../structures/config.json");
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
  name: "messageDeleteBulk",
  disabled: false,
  /**
   * @param {Message} oldMessage
   * @param {Message} newMessage
   * @param {Client} client
   */
  async execute(messages, client) {
    if(messages.guild === null) return;

    const message_logs = client.channels.cache.get(message_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await messages.first().guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first();

    if(!log) return;

    const NoOfMessages = messages.size;
    const message = await messages.map((m) => m);
    const channel = messages.first().channel;
    const ID = Math.floor(Math.random() * 5485444) + 4000000;

    const messageDeleteBulk = new MessageEmbed()
    .setColor(message_log_colour)
    .setTitle("Bulk deleted messages 📕")
    .setTimestamp();

    try { 
      const attachment = await discordTranscripts.generateFromMessages(message, channel, { returnBuffer: false, fileName: `transcript-${ID}.html` });

      if (log.action == "MESSAGE_BULK_DELETE") { 
        messageDeleteBulk.setDescription(`\`${NoOfMessages}\` messages were **bulk deleted** in ${channel} by \`${log.executor.tag}\` <t:${happen}:R>.`)
      } else {
        messageDeleteBulk.setDescription(`\`${NoOfMessages}\` messages were **bulk deleted** in ${channel} <t:${happen}:R>.`)
      }

      message_logs.send({ embeds: [messageDeleteBulk], files: [attachment] });
    } catch (e) {
      console.log(e)
    }
  },
};
