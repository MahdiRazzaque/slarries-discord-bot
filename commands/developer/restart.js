const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { developer_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "restart",
  description: "Restart the bot",
  userPermissions: ["ADMINISTRATOR"],
  botOwnerOnly: true,
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, member } = interaction;

    await interaction
      .reply({embeds: [new MessageEmbed().setColor(developer_embed_colour).setDescription(`${client.emojisObj.animated_tick} Restarting`)]})
      .then(() => {
        client.destroy();
        console.log("======================================================================")
        console.log(`[Client] Restart initiated by ${member.user.username} in ${guild.name}`);
      })
      .then(() => {
        client.login(process.env.TOKEN);
        console.log("Connected as " + client.user.tag);
        client.guilds.cache.forEach((guild) => {
          console.log(`${guild.name} | ${guild.id}`);
        });
        console.log("Ready! 🟢");
        console.log("======================================================================")
        interaction.editReply({embeds: [new MessageEmbed().setColor(developer_embed_colour).setDescription(`${client.emojisObj.animated_tick} Successfully restarted.`)]})
      });
  },
};
