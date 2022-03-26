const { MessageEmbed, Message, WebhookClient, CommandInteraction } = require("discord.js");
const { announcement_channel, admin_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "test",
  description: "test",
  usage: "/test",
  permission: "ADMINISTRATOR",
  disabled: false,
  ownerOnly: true,
  options: [
    {
      name: "message",
      description: "message",
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
    const text = interaction.options.getString("message");
    const webhook = new WebhookClient({url: "https://discord.com/api/webhooks/955527417408151562/1uHFwQug-2ToqrBcNe66eCysCsXYV5Y-bIkIGUE7ScJSqzXAPCT82rcNQ1T8c0YZwM0m"});

    const message = text.slice(text.indexOf(":") + 1).trim()
    const ignWithRanks = text.slice(0, text.indexOf(":")).replace("Guild > ", "")
    var ign = ignWithRanks.replace(/\[.*?\] /g, '')
    ign = ign.slice(0, ign.indexOf("[")).trim()

    interaction.reply("sent")

    webhook.send({
        content: `${message}`,
        username: `${ignWithRanks}`,
        avatarURL: `https://minotar.net/helm/${ign}/100.png`,
    })

  },
};
