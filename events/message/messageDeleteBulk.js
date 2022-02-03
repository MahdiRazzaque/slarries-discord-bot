const { Client, MessageEmbed, Message } = require("discord.js");
const { message_log_colour, message_logs_id, error_logs_id } = require("../../structures/config.json");
const { create } = require("sourcebin")

module.exports = {
  name: "messageDeleteBulk",
  disabled: false,
  /**
   * @param {Message} oldMessage
   * @param {Message} newMessage
   * @param {Client} client
   */
  async execute(messages, client) {
      let happen = Math.floor(new Date().getTime()/1000.0)

      const content = messages.map((m) => m.content).reverse()
      const authors = messages.map((m) => m.author.username).reverse()
      const discriminators = messages.map((m) => m.author.discriminator).reverse()
      const embeds = messages.map((m) => m.embeds).reverse()
      const channel = messages.map((m) => m.channelId)

      var messages = ``;

      for (var i = 0; i < authors.length; i++) {
        messages += `${authors[i]}#${discriminators[i]}: ${content[i] ? content[i] : "Embed"}\n`
      }
    
      const sourceBin = await create([{name: "Messages deleted", content: messages}])
      sourceBinURL = sourceBin.url

      const Log = new MessageEmbed()
      .setColor(message_log_colour)
      .setTitle("__Bulk deleted messages 📕__")
      .setDescription(`${authors.length} messages was **bulk deleted** in <#${channel[0]}> <t:${happen}:R>`)
      .addFields({name: "Deleted messages", value: `${sourceBinURL}`,})
      .setTimestamp();

      const message_logs = client.channels.cache
      .get(message_logs_id)
      .send({ embeds: [Log] });
},
};
