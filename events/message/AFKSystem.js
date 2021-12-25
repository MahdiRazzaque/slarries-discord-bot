const { Message, MessageEmbed } = require("discord.js");
const { afk_disabled } = require("../../structures/config.json")
const DB = require("../../structures/schemas/AFKSystem");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(afk_disabled) return
        
        if(message.author.bot) return;
        if(message.guild === null) return;

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