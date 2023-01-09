const { MessageEmbed, CommandInteraction } = require("discord.js");
const serverBotCommandChannelsDB = require("../../structures/schemas/serverBotCommandChannelsDB");
const { admin_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "bot-command-channels",
  description: "Configure bot command channels in this server.",
  usage: "/bot-command-channels",
  userPermissions: ["ADMINISTRATOR"],
  disabled: false,
  options: [
    {
        name: "show",
        description: "Show the current bot command channels in this server.",
        type: "SUB_COMMAND",
    },
    {
        name: "add",
        description: "Add a bot command channel.",
        type: "SUB_COMMAND",
        options: [{name: "channel", description: "The channel which you want to add.", type: "CHANNEL", channelTypes: ["GUILD_TEXT"], required: true}]
    },
    {
        name: "remove",
        description: "Remove a bot command channel.",
        type: "SUB_COMMAND",
        options: [{name: "channel", description: "The channel which you want to remove.", type: "CHANNEL", channelTypes: ["GUILD_TEXT"], required: true}]
    }
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {

    const channel = interaction.options.getChannel("channel") || null

    var data = await serverBotCommandChannelsDB.findOne({ GuildID: interaction.guild.id})

    if(!data)
        data = await serverBotCommandChannelsDB.create({ GuildID: interaction.guild.id, BotCommandChannels: []})

    switch(interaction.options.getSubcommand()) {
        case "show":
            var formattedBotCommandChannelsList;

            if(data.BotCommandChannels.length == 0) {
                formattedBotCommandChannelsList = "None"
            } else {
                formattedBotCommandChannelsList = `<#${data.BotCommandChannels.map(c => c).join(">, <#")}>`
            }

            return interaction.reply({ embeds: [new MessageEmbed().setColor(admin_embed_colour).setTitle(`Bot command channels for ${interaction.guild.name}`).setDescription(formattedBotCommandChannelsList)]})
        break;

        case "add":
            if (data.BotCommandChannels.includes(channel.id))
                return interaction.reply({embeds: [client.errorEmbed("This channel has already been set at a bot command channel.")]})

            await data.BotCommandChannels.push(channel.id)
            await data.save()
            
            return interaction.reply({embeds: [client.successEmbed(`${channel} was successfully added to the list.`)]})
        break;

        case "remove":
            if (!data.BotCommandChannels.includes(channel.id))
                return interaction.reply({embeds: [client.errorEmbed("This channel has not been set at a bot command channel.")]})

            data.BotCommandChannels.splice(data.BotCommandChannels.indexOf(channel.id), 1);
            await data.save();

            return interaction.reply({embeds: [client.successEmbed(`${channel} was successfully removed from the list.`)]})
        break;
    }
    

  },
};
