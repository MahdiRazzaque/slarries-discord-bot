const { MessageEmbed, Message, Client } = require('discord.js');
const { dm_logs_id } = require("../../structures/config.json")

module.exports = {
    name: "messageCreate",
    disabled: false,
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     * @returns 
     */
    async execute(message, client) {
        if(message.guild || message.author.bot) return;

        if(message.content.charAt(0) == "!") return;

        const dmEmbed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle(`DM from ${message.author.username}`)
            .setFooter({ text: message.author.id})
            .setTimestamp()
        
        const messageContent = message.content.slice(0, 998) + (message.content.length > 998 ? " ..." : "");
        if(messageContent)
            dmEmbed.setDescription(`\`\`\`${messageContent}\`\`\``)

        if (message.attachments.size >= 1) {
            const attachments = message.attachments.map((image) => `[${image.url.match(/\.([a-z]{3,4})\?/i)[1].replace(".", "").toUpperCase()}](${image.url})`)
            dmEmbed.addField(`Attachments`, `${attachments.join(", ")}`)
        }

        const dm_logs = client.channels.cache.get(dm_logs_id)

        dm_logs.send({ embeds: [dmEmbed]})

    }
}