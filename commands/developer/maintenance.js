const { CommandInteraction, MessageEmbed } = require("discord.js");
const fs = require("fs");
const { maintenance_disabled, developer_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "maintenance",
  description: "Put the bot into maintenance mode.",
  permission: "ADMINISTRATOR",
  usage: "/maintenance",
  /**
   *
   * @param {CommandInteraction} interaction
   */
  execute(interaction, client) {
    if(maintenance_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setDescription("<a:animated_cross:925091847905366096> **Command Disabled**")], ephemeral: true})};
    
    if (client.maintenance === false &&interaction.user.id == "381791690454859778") {
      client.maintenance = true;

      const bot = new MessageEmbed()
        .setColor(developer_embed_colour)
        .setTitle("<a:animated_tick:925091839030231071> Maintenance mode has been **enabled**. ")
        .setDescription(`👷‍♂️ The bot has been put into maintenance mode. 👷‍♂️`)
        .setTimestamp();

      return interaction.reply({ embeds: [bot], ephemeral: true });
    }

    if (client.maintenance && interaction.user.id == "381791690454859778") {
      client.maintenance = false;

      const bot = new MessageEmbed()
        .setColor("RED")
        .setTitle("<a:animated_tick:925091839030231071> Maintenance mode has been **disabled**.")
        .setDescription(`👷‍♂️ The bot has been taken out of maintenance mode. 👷‍♂️`)
        .setTimestamp();

      return interaction.reply({ embeds: [bot], ephemeral: true });
    }
  },
};
