const { MessageEmbed, Message } = require("discord.js");
const { admin_embed_colour } = require("../../structures/config.json");

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
    
    const { options } = interaction;

    const message = options.getString("message") || "none";
    const member = options.getUser("user")

    if(member.id === client.user.id) return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle(`Error ${client.emojisObj.animated_cross}`).setDescription("🙄 I cannot DM myself.")]})
    
    try {
      const sendMessage = await member.send(message);
      interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} The message was successfully sent to ${member}.`)],ephemeral: true});
    } catch (error) {
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_tick} An error occured. Mostly likely, the users DMs are closed.`)], ephemeral: true}) 
    }
  },
};
