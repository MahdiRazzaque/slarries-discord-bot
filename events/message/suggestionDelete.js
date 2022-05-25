const { Client, MessageEmbed, Message } = require("discord.js");
const suggestSetupDB = require("../../structures/schemas/suggestSetupDB");
const suggestDB = require("../../structures/schemas/suggestDB");

module.exports = {
  name: "messageDelete",
  disabled: false,
  /**
   * @param {Message} message
   */
  async execute(message, client) {
    if(!message.guild) return;

    const suggestSetup = await suggestSetupDB.findOne({ GuildID: message.guild.id });
    if(!suggestSetup) return;
    
    const suggestion = await suggestDB.findOne({GuildID: message.guild.id, MessageID: message.id});
    if(!suggestion) return;

    return suggestDB.deleteOne({GuildID: message.guild.id, MessageID: message.id})
  },
};

