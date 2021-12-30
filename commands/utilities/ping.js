const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { ping_disabled } = require("../../structures/config.json");

module.exports = {
  name: "ping",
  description: "Sends the bot's ping.",
  usage: "/ping",
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (ping_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setDescription("<a:animated_cross:925091847905366096> **Command Disabled**")], ephemeral: true})};
    
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
