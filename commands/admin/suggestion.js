const { MessageEmbed, Message, CommandInteraction, Client, Permissions } = require("discord.js");
const { admin_embed_colour } = require("../../structures/config.json");
const suggestSetupDB = require("../../structures/schemas/suggestSetupDB");
const suggestDB = require("../../structures/schemas/suggestDB");

module.exports = {
  name: "suggestion",
  description: "Accept or decline a suggestion.",
  usage: "/suggestion",
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
    {
      name: "delete",
      description: "Delete a suggestion.",
      type: "SUB_COMMAND",
      options: [
        {name: "message-id", description: "The message id of the suggestion you want to decline.", type: "STRING", required: true},
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

    if(reason) {
      if(reason.length > 1024)
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} Your reason can't be longer than 1024 characters.`)], ephemeral: true})
    }
    
    const suggestSetup = await suggestSetupDB.findOne({ GuildID: interaction.guildId });
    var suggestionsChannel;

    if(!suggestSetup) {
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This server has not setup the suggestion system.`)]})
    } else {
      suggestionsChannel = interaction.guild.channels.cache.get(suggestSetup.ChannelID)
    }

    var suggestionManager;
    
    if(suggestSetup.SuggestionManagers.length <= 0 || !suggestSetup.SuggestionManagers) {
      if(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        suggestionManager = true;
      } else if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)  && interaction.options.getSubcommand() != "delete") 
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You are not a suggestion manager.`)], ephemeral: true});    
    } else {
      for (var i = 0; i < suggestSetup.SuggestionManagers.length; i++) {
        if (!interaction.member.roles.cache.has(suggestSetup.SuggestionManagers[i])) 
          continue;
          
        if (interaction.member.roles.cache.has(suggestSetup.SuggestionManagers[i]) || interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) 
          suggestionManager = true;
    }
    if(!suggestionManager && interaction.options.getSubcommand() != "delete")
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You are not a suggestion manager.`)], ephemeral: true});
    }

    const suggestion = await suggestDB.findOne({GuildID: interaction.guild.id, MessageID: messageId});

    if(!suggestion)
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This suggestion was not found in the database.`)], ephemeral: true})

    const message = await suggestionsChannel.messages.fetch(messageId)

    if(!message)
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This message was not found.`)], ephemeral: true})

    const Embed = message.embeds[0];
    if(!Embed) return;
    
    switch(interaction.options.getSubcommand()) {
      case "accept":
        Embed.fields[1] = {name: "Status", value: "Accepted", inline: true};
        Embed.fields[2] = {name: "Reason", value: `${reason}`, inline: true}
        message.edit({embeds: [Embed.setColor("GREEN")], content: `<@${suggestion.MemberID}>`, components: []});

        if(suggestion.DM) {
          const member = client.users.cache.get(suggestion.MemberID);
          member.send({embeds: [new MessageEmbed().setColor("GREEN").setTitle("Suggestion 💡").setDescription(`${client.emojisObj.animated_tick} Your suggestion was accepted.`).addFields({name: "Suggestion", value: `[link](${message.url})`, inline: true}, {name: "Guild", value: `${interaction.guild.name}`, inline: true}, {name: "Reason", value: `${reason}`, inline: true})]}).catch(() => null)
        }
        return interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} [Suggestion](${message.url}) was accepted.`)], ephemeral: true})
      break;

      case "decline":
        Embed.fields[1] = {name: "Status", value: "Declined", inline: true};
        Embed.fields[2] = {name: "Reason", value: `${reason}`, inline: true}
        message.edit({embeds: [Embed.setColor("RED")], content: `<@${suggestion.MemberID}>`, components: []});

        if(suggestion.DM) {
          const member = client.users.cache.get(suggestion.MemberID);
          member.send({embeds: [new MessageEmbed().setColor("RED").setTitle("Suggestion 💡").setDescription(`${client.emojisObj.animated_cross} Your suggestion was declined.`).addFields({name: "Suggestion", value: `[link](${message.url})`, inline: true}, {name: "Guild", value: `${interaction.guild.name}`, inline: true}, {name: "Reason", value: `${reason}`, inline: true})]}).catch(() => null)
        }
        return interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} [Suggestion](${message.url}) declined.`)], ephemeral: true})
      break;
      
      case "delete":
        if(!suggestSetup.AllowOwnSuggestionDelete && !suggestionManager) {
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You cannot delete this [suggestion](${message.url})`)]})
        } else if (suggestionManager) {
          await message.delete()
          return interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} This suggestion was deleted.`)]})
        } else if(suggestSetup.AllowOwnSuggestionDelete) {
          if(suggestion.MemberID === interaction.member.id) {
            await message.delete()
            return interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} Your suggestion was deleted.`)]})  
          } else {
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This isn't your suggestion.`)]})  
          }
        }
      break;
    }
  },
};
