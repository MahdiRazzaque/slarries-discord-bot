const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Sends the bot's ping.",
  usage: "/ping",
  disabled: false,
  botCommandChannelOnly: true,
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {   
    //await interaction.reply({ content: "Loading data" });
    interaction.channel.send("ㅤ").then(async (resultMessage) => {
      const ping = resultMessage.createdTimestamp - interaction.createdTimestamp;
      const response = new MessageEmbed()
        .setColor("AQUA")
        .setTitle("🏓 PONG!")
        .addFields(
          { name: "Ping", value: `${ping}ms` },
          { name: "API Latency", value: `${Math.round(client.ws.ping)}ms` }
        );
      await interaction.reply({ embeds: [response] });
      resultMessage.delete();
    });
  },
};
