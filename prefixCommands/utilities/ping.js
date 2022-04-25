const { MessageEmbed, Message, Client } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["latency", "lag"],
  description: "Check the bots ping",
  cooldown: 5,
  botCommandChannelOnly: true,
  ownerOnly: false,
  botOwnerOnly: false,
  roles: [],
  whitelist: [],
  /**
   * @param {Message} message 
   * @param {Client} client 
   */
  execute(message, args, commandName, Prefix, client) {
    message.channel.send("ㅤ").then(async (resultMessage) => {
    const ping = resultMessage.createdTimestamp - message.createdTimestamp;
    const response = new MessageEmbed()
      .setColor("AQUA")
      .setTitle("🏓 PONG!")
      .addFields(
        { name: "Ping", value: `${ping}ms` },
        { name: "API Latency", value: `${Math.round(client.ws.ping)}ms` }
      );
    await message.reply({embeds: [response]});
    resultMessage.delete();
  });
  },
};
