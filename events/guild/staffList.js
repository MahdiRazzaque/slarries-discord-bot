const { Client, MessageEmbed } = require('discord.js')
const ms = require("ms")

const Staff = [
    "Owner",
    "Admin",
    "Slayer Carrier",
    "Dungeon Carrier",
]

const Config = {
    GuildID: "916385872356733000",
    StaffChannelID: "936366839766868009",
    StaffMessageID: "936367044725714944"
}

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    execute(client) {

        if (!Config.GuildID) return
        if (!Config.StaffChannelID) return
        if (!Config.StaffMessageID) return

        setInterval(async function () {
            let msg = await client.channels.cache.get(Config.StaffChannelID).messages.fetch(Config.StaffMessageID)

            var updateDate = Date.now() + ms("300s")
            updateDate = updateDate.toString().slice(0, -3)

            const List = new MessageEmbed()
            .setColor('AQUA')
            .setTitle('Staff List')
            .setTimestamp()
            Staff.forEach((staff) => {
                List.addFields({ name: `${staff}:`, value: `${client.guilds.cache.get(Config.GuildID).roles.cache.find(r => r.name == staff).members.map(m => `${m.user}`).join(", ") || "⠀"}`, inline: false })
            })
            List.addField("Next update", `<t:${updateDate}:R>`)
            msg.edit({ embeds: [List], content: " " })
    
        }, 300 * 1000)
    }
}