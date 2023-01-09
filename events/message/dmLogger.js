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
    execute(message, client) {
        if(!message.channel.type === "dm" || message.author.bot) return;

        if(message.content.charAt(0) == "!") return;

        const dmEmbed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle(`DM from ${message.author.username}`)
            .setFooter({ text: message.author.id})
            .setTimestamp()
        
        const messageContent = message.content.slice(0, 998) + (message.content.length > 998 ? " ..." : "");
        dmEmbed.setDescription(`\`\`\`${messageContent}\`\`\``)

        if (message.attachments.size >= 1) {
            dmEmbed.addField(`Attachments`, `${message.attachments.map((image) => `[Image](${image.url})`).join(", ")}`)
        }

        const dm_logs = client.channels.cache.get(dm_logs_id)

        dm_logs.send({ embeds: [dmEmbed]})

    }
}