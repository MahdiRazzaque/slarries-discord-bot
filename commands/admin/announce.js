const { MessageEmbed, Message } = require("discord.js");
const { announcement_channel, admin_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "announce",
  description: "Announce a message to the announcement channel.",
  usage: "/announce",
  permission: "ADMINISTRATOR",
  disabled: false,
  options: [
    {
      name: "announcement",
      description: "The announement that you want to be sent.",
      type: "STRING",
      required: true,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    
    const { options } = interaction;

    const announcement = options.getString("announcement");

    let announcementChannel = client.channels.cache.get(announcement_channel);
    announcementChannel.send(`${announcement}\n ||@everyone||`); 

    interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`<a:animated_tick:925091839030231071> The announcement was successfully sent to ${announcementChannel}.`)],ephemeral: true});
  },
};
