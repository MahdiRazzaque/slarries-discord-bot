const { CommandInteraction, MessageEmbed, Client } = require('discord.js');
const { music_disabled, music_embed_colour } = require("../../structures/config.json");

module.exports = {
    name: "play",
    description: "Plays a song/Adds a song to the queue.",
    usage: "/play",
    options: [
        {name: "query",
        description: "Provide a song name or link.",
        type: "STRING",
        required: true}
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

        if(!VoiceChannel)
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("You must be in a voice channel to be able to use this command.")]})

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`I am already playing music in <#${guild.me.voice.channelId}>.`)]})

        try{
            client.distube.playVoiceChannel( VoiceChannel, options.getString("query"), { textChannel: channel, member: member});
            return interaction.reply({embeds: [new MessageEmbed()
            .setColor(music_embed_colour)
            .setDescription("🎼 Request recieved.")]})

        } catch (e) {
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle("Error! ❌").setDescription(`${e}`)], ephemeral: true});
        }
    }
}