const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");

module.exports = {
    name: "save-channel",
    description: "Saves channel",
    userPermissions: ["ADMINISTRATOR"],

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { channel } = interaction;

        const reply = await interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setDescription("⌛ Saving channel.")], fetchReply: true})
        
        const attachment = await createTranscript(channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${channel.name.replace(/[\\/:*?\"<>|]/g,"").substring(0,240)}.html`,
        });

        await reply.edit({ embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${client.emojisObj.animated_tick} Channel successfully saved.`)], files: [attachment] });
    }
}