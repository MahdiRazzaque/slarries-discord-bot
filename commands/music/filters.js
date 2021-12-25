const { CommandInteraction, MessageEmbed, Client } = require('discord.js');
const { music_disabled, music_embed_colour } = require("../../structures/config.json");

module.exports = {
    name: "filters",
    description: "Apply filters to the music.",
    usage: "/filters",
    options: [
        {
            name: "set",
            description: "Set filters to the song.",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Turn off all the filters",
                    value: "false"
                },
                {
                    name: "Toggle 8D Filter",
                    value: "8d"
                },
                {
                    name: "Toggle bassboost Filter",
                    value: "bassboost"
                },
                {
                    name: "Toggle echo filter",
                    value: "echo"
                },
                {
                    name: "Toggle nightcore filter",
                    value: "nightcore"
                },
                {
                    name: "Toggle surround filter",
                    value: "surround"
                },
            ],
        },
    ], 

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(music_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setTitle("**Command Disabled** ❌")], ephemeral: true})};

        const { options, member, guild, channel } = interaction;
        const VoiceChannel = member.voice.channel;
        const queue = await client.distube.getQueue(VoiceChannel);
        const choices = interaction.options.getString("set");
        

        if(!VoiceChannel)
        return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setDescription("You must be in a voice channel to be able to use this command.")]})

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setDescription(`I am already playing music in <#${guild.me.voice.channelId}>.`)]})

        try{
            switch(choices) {
                case "false" : {
                    queue.setFilter(false);
                    return interaction.reply({ embeds: [new MessageEmbed().setColor(music_embed_colour).setDescription(`🎧 Turned off all the filters.`)]});
                }
                case "8d" : {
                    queue.setFilter(`3d`);
                    return interaction.reply({ embeds: [new MessageEmbed().setColor(music_embed_colour).setDescription(`🎱 Toggled the 8D filter.`)]});
                }
                case "bassboost" : {
                    queue.setFilter(`bassboost`);
                    return interaction.reply({ embeds: [new MessageEmbed().setColor(music_embed_colour).setDescription(`🥁 Toggled the bassboost filter.`)]});
                }
                case "echo" : {
                    queue.setFilter(`echo`);
                    return interaction.reply({ embeds: [new MessageEmbed().setColor(music_embed_colour).setDescription(`🦇 Toggled the echo filter.`)]});
                }
                case "nightcore" : {
                    queue.setFilter(`nightcore`);
                    return interaction.reply({ embeds: [new MessageEmbed().setColor(music_embed_colour).setDescription(`🌑 Toggled the nightcore filter.`)]});
                }
                case "surround" : {
                    queue.setFilter(`surround`);
                    return interaction.reply({ embeds: [new MessageEmbed().setColor(music_embed_colour).setDescription(`😵 Toggled the surround filter.`)]});
                }
            }
        } catch (e) {
return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle("Error! ❌").setDescription(`${e}`)], ephemeral: true});
        }
    }
}