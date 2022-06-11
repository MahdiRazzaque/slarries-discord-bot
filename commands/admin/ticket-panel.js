const { MessageEmbed, Message, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const { ticket_panel_colour, admin_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "ticket-panel",
  description: "Send the ticket panel.",
  usage: "/ticket-panel",
  userPermissions: ["ADMINISTRATOR"],
  disabled: false,
  ownerOnly: true,
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {

    await interaction.deferReply({ephemeral: true})

    const embed = new MessageEmbed()
        .setColor(ticket_panel_colour)
        .setTitle('**How to buy carries**')
        .setDescription(
            "> Press the button below to create a ticket.\n \n" +

            "> Once the ticket is made, please follow the intructions in that channel. \n \n" +

            "> *For slayer carries, please try to get the kills before opening a ticket*"
        )

    const buttons = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('slayer-ticket')
                .setLabel('Slayer Carry')
                .setStyle('PRIMARY')
                .setEmoji("<:maddox:922918383094214697>"),
            new MessageButton()
                .setCustomId("dungeon-ticket")
                .setLabel("Dungeon Carry")
                .setStyle("SECONDARY")
                .setEmoji("<:mort:922923214647226380>"),
        ); 

    await interaction.channel.send({embeds: [embed], components: [buttons]}).then(() => {
        return interaction.editReply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} The ticket panel has been sent.`)], ephemeral: true})
    })
    
  },
};
