const { MessageEmbed, Message } = require("discord.js");
const { send_message_disabled, admin_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "send-message",
  description: "Send a message to a specific channel.",
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
      name: "channel",
      description: "Select a channel to send the message to.",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (send_message_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setTitle("**Command Disabled** ❌")], ephemeral: true})};
    
    const { options } = interaction;

    const message = options.getString("message") || "none";
    const gChannel = options.getChannel("channel") || interaction.channel;

    if (message === "none") {interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle("Error ❌").setDescription("Please set a message to be sent!")]})};
    
    const sendMessage = await client.channels.cache.get(gChannel.id).send(message);

    interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`The message was successfully sent to ${gChannel} ✅`)],ephemeral: true});
  },
};
