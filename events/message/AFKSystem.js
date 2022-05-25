const { Message, MessageEmbed } = require("discord.js");
const DB = require("../../structures/schemas/AFKSystem");

module.exports = {
    name: "messageCreate",
    disabled: false,
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(message.author.bot || !message.guild) return;

        await DB.deleteOne({GuildID: message.guild.id, UserID: message.author.id})
        
        if(message.mentions.members.size) {
            const Embed = new MessageEmbed()
            .setColor("RED");
            message.mentions.members.forEach((m) => {
                DB.findOne({GuildID: message.guild.id, UserID: m.id}, async (err, data) => {
                    if(err) throw err;
                    if(data) {
                        Embed.setTitle("Member AFK");
                        Embed.addField("Member", `${m}`)
                        Embed.addField("Time", `<t:${data.Time}:R>`)
                        Embed.addField("Status", `${data.Status}`)
                        return message.reply({embeds: [Embed]})
                    }
                })
            })
        }
    }
}