const { CommandInteraction, MessageEmbed, Client } = require('discord.js');
const { music_disabled, music_embed_colour } = require("../../structures/config.json");

module.exports = {
    name: "seek",
    description: "Seeks the song to a specified position.",
    usage: "/seek",
    options: [
        {
            name: "time",
            description: "Provide a position (in seconds) to seek.",
            type: "NUMBER",
            required: true
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
        const Time = options.getNumber("time");

        if(!VoiceChannel)
        return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setDescription("You must be in a voice channel to be able to use this command.")]})

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setDescription(`I am already playing music in <#${guild.me.voice.channelId}>.`)]})

        try{

            await queue.seek(Time);
            return interaction.reply({ embeds: [new MessageEmbed().setColor(music_embed_colour).setDescription(`⌛ Seeked to \`${Time}\``)]});

        } catch (e) {
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle("Error! ❌").setDescription(`${e}`)], ephemeral: true});
        }
    }
}