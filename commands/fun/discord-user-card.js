const { CommandInteraction, MessageEmbed, Client, MessageAttachment } = require("discord.js");
const { fun_embed_colour } = require("../../structures/config.json");
const { profileImage } = require('discord-arts');

module.exports = {
  name: "discord-user-card",
  description: "Generate a discord user card.",
  usage: "/iscord-user-card [member]",
  disabled: false,
  botCommandChannelOnly: true,
  options: [
    {
      name: "member",
      description: "The member you'd like to generate a card for.",
      type: "USER",
      required: false,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const user = interaction.options.getUser("member") || interaction.user;

    await interaction.reply({embeds: [new MessageEmbed().setColor(fun_embed_colour).setDescription(`Generating image ${client.emojisObj.timer_loading}`)]})

    const image = await profileImage(user.id);

    return interaction.editReply({embeds: [], files: [new MessageAttachment(image)]})


  },
};
