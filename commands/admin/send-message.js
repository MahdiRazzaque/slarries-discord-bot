const { MessageEmbed, Message } = require("discord.js");
const { admin_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "send-message",
  description: "Send a message to a specific channel.",
  usage: "/send-message",
  userPermissions: ["ADMINISTRATOR"],
  disabled: false,
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
    
    const { options } = interaction;

    const message = options.getString("message") || "none";
    const gChannel = options.getChannel("channel") || interaction.channel;
    
    const sendMessage = await client.channels.cache.get(gChannel.id).send(message);

    interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} The message was successfully sent to ${gChannel}. `)],ephemeral: true});
  },
};
