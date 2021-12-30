const { MessageEmbed, Message } = require("discord.js");
const { direct_message_disabled, admin_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "direct-message",
  description: "Send a message to the user.",
  usage: "/send-message",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "message",
      description: "The message that you want to be sent.",
      type: "STRING",
      required: true,
    },
    {
      name: "user",
      description: "Select a user to send the message to.",
      type: "USER",
      required: true
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!direct_message_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setDescription("<a:animated_cross:925091847905366096> **Command Disabled** ")], ephemeral: true})};
    
    const { options } = interaction;

    const message = options.getString("message") || "none";
    const member = options.getUser("user")

    if(member.id === client.user.id) return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle("Error <a:animated_cross:925091847905366096>").setDescription("🙄 I cannot DM myself.")]})
    
    const sendMessage = await member.send(message);

    interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`<a:animated_tick:925091839030231071> The message was successfully sent to ${member}.`)],ephemeral: true});
  },
};
