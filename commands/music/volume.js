const { CommandInteraction, MessageEmbed, Client } = require('discord.js');
const { music_disabled, music_embed_colour } = require("../../structures/config.json");

module.exports = {
    name: "volume",
    description: "Changes the volume of the music.",
    usage: "/volume",
    options: [
        {name: "percent",
        description: "Provide a percentage of volume for the bot(1-100).",
        type: "NUMBER",
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
        return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setDescription("You must be in a voice channel to be able to use this command.")]})

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setDescription(`I am already playing music in <#${guild.me.voice.channelId}>.`)]})

        try{
            const Volume = options.getNumber("percent");
            if(Volume > 100 || Volume < 1)
            return interaction.reply({embeds: [new MessageEmbed().setColor('RED').setDescription("You have to specify a number between 1 and 100.")]});

            client.distube.setVolume(VoiceChannel, Volume);
            return interaction.reply({ embeds: [new MessageEmbed().setColor(music_embed_colour).setDescription(`📶 Volume has been set to \`${Volume}%\``)]});

        } catch (e) {
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle("Error! ❌").setDescription(`${e}`)], ephemeral: true});
        }
    }
}