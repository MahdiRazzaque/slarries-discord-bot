const { MessageEmbed, Message, CommandInteraction, Client } = require("discord.js");
const { admin_embed_colour } = require("../../structures/config.json");
const DB = require("../../structures/schemas/suggestSetupDB");

module.exports = {
  name: "suggest-setup",
  description: "Set up the channel to where suggestions are sent.",
  usage: "/suggest-setup",
  permission: "ADMINISTRATOR",
  options: [
    {
        name: "set",
        description: "Set the channel where suggestions will be sent.",
        type: "SUB_COMMAND",
        options: [
            {name: "channel", description: "The channel where suggestions will be sent.", type: "CHANNEL", channelTypes: ["GUILD_TEXT"], required: true}
        ]
    },
    {
        name: "channel",
        description: "Display the current suggestions channel.",
        type: "SUB_COMMAND",
    },
    {
        name: "reset",
        description: "Reset the suggestion channel.",
        type: "SUB_COMMAND",
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {

    switch(interaction.options.getSubcommand()) {
        case "set":
            const channel = interaction.options.getChannel("channel");

            try {
                await channel.send({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} This channel has been set as a suggestions channel.`)]}).then(async() => {
                    await DB.findOneAndUpdate({GuildID: interaction.guild.id}, {ChannelID: channel.id}, {new: true, upsert: true})
                    interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} ${channel} has successfully been set as the suggestions channel for ${interaction.guild.name}.`)]})
                })
            } catch (error) {
                if(error.message === "Missing Access") {
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The bot does not have access to this channel.`)]})
                } else {
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} An error occured. \n\n \`\`\`${error}\`\`\``)]})
                }    
            }
        break;
        case "channel":
            var suggestion = await DB.findOne({GuildID: interaction.guild.id})

            if(!suggestion)
                return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This server has not setup the suggestion system.`)]})

            return interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`The suggestions channel is currently set to <#${suggestion.ChannelID}>`)]})
        break;
        case "reset":
            var suggestion = await DB.findOne({GuildID: interaction.guild.id})

            if(!suggestion)
                return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This server has not setup the suggestion system.`)]})

            DB.deleteOne({GuildID: interaction.guild.id})
            .then(() => {
                return interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} The suggestions channel has successfully been reset.`)]})
            })
        break;
    }


  },
};
