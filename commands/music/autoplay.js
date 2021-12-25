const { CommandInteraction, MessageEmbed, Client } = require('discord.js');
const { music_disabled, music_embed_colour } = require("../../structures/config.json");

module.exports = {
    name: "autoplay",
    description: "Toggles autoplay.",
    usage: "/autoplay",

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

        if(!VoiceChannel)
        return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setDescription("You must be in a voice channel to be able to use music commands.")]})

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setDescription(`I am already playing music in <#${guild.me.voice.channelId}>.`)]})

        try{

            let Mode = await queue.toggleAutoplay(VoiceChannel);
            return interaction.reply({ embeds: [new MessageEmbed().setColor(music_embed_colour).setDescription(`🔃 AutoPlay Mode has been set to: ${Mode ? "On" : "Off"}`)]});

        } catch (e) {
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle("Error! ❌").setDescription(`${e}`)], ephemeral: true});
        }
    }
}