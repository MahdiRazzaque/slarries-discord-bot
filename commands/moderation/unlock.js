const { CommandInteraction, MessageEmbed, Client, Channel } = require("discord.js");
const DB = require("../../structures/schemas/lockdownDB");

module.exports = {
    name: "unlock",
    description: "Life a lockdown from a channel",
    permission: "MANAGE_CHANNELS",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { guild, channel } = interaction;

        const Embed = new MessageEmbed();

        if (channel.permissionsFor(guild.id).has("SEND_MESSAGES"))
            return interaction.reply({ embeds: [Embed.setColor("RED").setDescription("<a:animated_cross:925091847905366096> This channel is not locked")], ephemeral: true});

        channel.permissionOverwrites.edit(guild.id, {SEND_MESSAGES: null})

        await DB.deleteOne({ ChannelID: channel.id });
        
        interaction.reply({embeds: [Embed.setColor("GREEN").setDescription("🔓 Lockdown has been lifted.")]})
    }
}