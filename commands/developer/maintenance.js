const { CommandInteraction, MessageEmbed } = require("discord.js");
const fs = require("fs");
const { developer_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "maintenance",
  description: "Put the bot into maintenance mode.",
  usage: "/maintenance",
  userPermissions: ["ADMINISTRATOR"],
  disabled: false,
  botOwnerOnly: true,
  /**
   *
   * @param {CommandInteraction} interaction
   */
  execute(interaction, client) {    
    if (client.maintenance === false &&interaction.user.id == "381791690454859778") {
      client.maintenance = true;

      const bot = new MessageEmbed()
        .setColor(developer_embed_colour)
        .setTitle(`${client.emojisObj.animated_tick} Maintenance mode has been **enabled**. `)
        .setDescription(`👷‍♂️ The bot has been put into maintenance mode. 👷‍♂️`)
        .setTimestamp();

      return interaction.reply({ embeds: [bot], ephemeral: true });
    }

    if (client.maintenance && interaction.user.id == "381791690454859778") {
      client.maintenance = false;

      const bot = new MessageEmbed()
        .setColor("RED")
        .setTitle(`${client.emojisObj.animated_tick} Maintenance mode has been **disabled**.`)
        .setDescription(`👷‍♂️ The bot has been taken out of maintenance mode. 👷‍♂️`)
        .setTimestamp();

      return interaction.reply({ embeds: [bot]});
    }
  },
};
