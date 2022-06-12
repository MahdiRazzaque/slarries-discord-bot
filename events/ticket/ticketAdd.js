const { Message, MessageEmbed } = require("discord.js");
const { transcripts_channel_id, ticket_enabled } = require("../../structures/config.json");
const DB = require("../../structures/schemas/ticketDB");

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Message} message
     */
    async execute(message, client) {
        if(!message.guild) return;

        const data = await DB.findOne({ ChannelID: message.channel.id })

        if(!data) return;

        if(data.MembersID.includes(message.author.id)) return;

        data.MembersID.push(message.author.id)

        return data.save();     
    }
}