const { CommandInteraction, MessageEmbed } = require("discord.js");
const { developer_embed_colour } = require("../../structures/config.json");
const botConfigDB = require("../../structures/schemas/botConfigDB")

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
  async execute(interaction, client) {
    const botConfig = await botConfigDB.findOne({ BotID: client.user.id })

    botConfig.MaintenanceMode = botConfig.MaintenanceMode ? false : true
    await botConfig.save()

    const maintenanceModeEmbed = new MessageEmbed()
      .setColor(developer_embed_colour)
      .setTitle(`Maintenance mode 👷‍♂️`)
      .setDescription(`Maintenance mode has been ${botConfig.MaintenanceMode ? "enabled" : "disabled"}.`)
      .setTimestamp();

    return interaction.reply({ embeds: [maintenanceModeEmbed]});
  },
};
