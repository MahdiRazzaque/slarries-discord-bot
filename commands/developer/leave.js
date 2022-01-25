const { Client, MessageEmbed, CommandInteraction } = require('discord.js');
const { developer_embed_colour } = require("../../structures/config.json")

module.exports = {
    name: 'leave',
    description: 'Leave a guild using guild ID',
    usage: "/leave",
    permission: "ADMINISTRATOR",
    disabled: false,
    botOwnerOnly: true,
    options: [
        {
            name: 'guildid',
            description: 'State the id of the guild you want the bot to leave.',
            type: 'STRING',
            required: true,
        },
    ],
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} Client
     */
    async execute(interaction, client) {
        const guildId = interaction.options.getString("guildid");
        var guild = client.guilds.cache.get(guildId);
        if(!guild) return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This guild does not exist.`)], ephemeral: true})
        
        try {
            guild.leave()
            return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${client.emojisObj.animated_tick} ${client.user.username} has successfully left ${guild}`)], ephemeral: true})  
        } catch (error) {
            return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${client.emojisObj.animated_tick} ${client.user.username} failed to leave ${guild}`).addField("Error", `${error}`)], ephemeral: true})
        }
    },
};