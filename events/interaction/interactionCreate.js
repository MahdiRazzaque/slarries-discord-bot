const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (client.maintenance && interaction.user.id != "381791690454859778") {
      const Response = new MessageEmbed()
        .setTitle("👷‍♂️ MAINTENANCE 👷‍♂️")
        .setDescription("Sorry the bot will be back shortly when everything is working correctly.")
        .setColor("RED");

      return interaction.reply({ embeds: [Response], ephemeral: true });
    }

    if (interaction.isCommand() || interaction.isContextMenu()) {
      const command = client.commands.get(interaction.commandName);
      if (!command)
        return (interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("🛑 An error has occured whilst running this command")]}) && client.commands.delete(interaction.commandName));

      const cmd = client.commands.get(interaction.commandName);

      command.execute(interaction, client);
    }
  },
};
