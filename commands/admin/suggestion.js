const { MessageEmbed, Message, CommandInteraction, Client } = require("discord.js");
const { admin_embed_colour } = require("../../structures/config.json");
const suggestSetupDB = require("../../structures/schemas/suggestSetupDB")
const suggestDB = require("../../structures/schemas/suggestDB");

module.exports = {
  name: "suggestion",
  description: "Set up the channel to where suggestions are sent.",
  usage: "/suggestion",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "accept",
      description: "Accept a suggestion.",
      type: "SUB_COMMAND",
      options: [
        {name: "message-id", description: "The message id of the suggestion you want to accept.", type: "STRING", required: true},
        {name: "reason", description: "The reason why this suggestion was accepted.", type: "STRING", required: true}
      ]
    },
    {
      name: "decline",
      description: "Decline a suggestion.",
      type: "SUB_COMMAND",
      options: [
        {name: "message-id", description: "The message id of the suggestion you want to decline.", type: "STRING", required: true},
        {name: "reason", description: "The reason why this suggestion was declined.", type: "STRING", required: true}
      ]
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const messageId = interaction.options.getString("message-id");
    const reason = interaction.options.getString("reason");

    const suggestionsSetup = await suggestSetupDB.findOne({ GuildID: interaction.guildId });
    var suggestionsChannel;

    if(!suggestionsSetup) {
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This server has not setup the suggestion system.`)]})
    } else {
      suggestionsChannel = interaction.guild.channels.cache.get(suggestionsSetup.ChannelID)
    }

    const suggestion = await suggestDB.findOne({GuildID: interaction.guild.id, MessageID: messageId})

    if(!suggestion)
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This suggestion was not found in the database.`)]})

    const message = await suggestionsChannel.messages.fetch(messageId)

    if(!message)
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This message was not found.`)]})

    const Embed = message.embeds[0];
    if(!Embed) return;
    
    switch(interaction.options.getSubcommand()) {
      case "accept":
        Embed.fields[1] = {name: "Status", value: "Accepted", inline: true};
        Embed.fields[2] = {name: "Reason", value: `${reason}`, inline: true}
        message.edit({embeds: [Embed.setColor("GREEN")], content: `<@${suggestion.MemberID}>`});

        if(suggestion.DM) {
          const member = client.users.cache.get(suggestion.MemberID);
          member.send({embeds: [new MessageEmbed().setColor("GREEN").setTitle("Suggestion 💡").setDescription(`Your suggestion was accepted ✅`).addFields({name: "Suggestion", value: `[link](${message.url})`, inline: true}, {name: "Guild", value: `${interaction.guild.name}`, inline: true}, {name: "Reason", value: `${reason}`, inline: true})]}).catch(() => null)
        }
        return interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`[Suggestion](${message.url}) was accepted ✅`)], ephemeral: true})
      break;

      case "decline":
        Embed.fields[1] = {name: "Status", value: "Declined", inline: true};
        Embed.fields[2] = {name: "Reason", value: `${reason}`, inline: true}
        message.edit({embeds: [Embed.setColor("RED")], content: `<@${suggestion.MemberID}>`});

        if(suggestion.DM) {
          const member = client.users.cache.get(suggestion.MemberID);
          member.send({embeds: [new MessageEmbed().setColor("RED").setTitle("Suggestion 💡").setDescription(`Your suggestion was declined. ✅`).addFields({name: "Suggestion", value: `[link](${message.url})`, inline: true}, {name: "Guild", value: `${interaction.guild.name}`, inline: true}, {name: "Reason", value: `${reason}`, inline: true})]}).catch(() => null)
        }
        return interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`[Suggestion](${message.url}) declined ✅`)], ephemeral: true})
      break;
    }
  },
};
