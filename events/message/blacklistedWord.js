const { blacklistedWords } = require("../../structures/blacklistedWords");
const { MessageEmbed, Client, Message } = require("discord.js");
const { message_logs_id, message_log_colour } = require("../../structures/config.json")

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {

        for (var i = 0; i < blacklistedWords.length; i++) {
            if (message.content.toLowerCase().includes(blacklistedWords[i])) {
                await message.channel.send({content: `${message.author}`, embeds: [new MessageEmbed().setColor("RED").setTitle("Blacklisted Word").setDescription(`${message.author} please do not use that word(s) as it is included in this server's blacklisted words.`)]})
                .then((m) => {setTimeout(() => {m.delete().catch(() => {})}, 1 * 5000)})

                message.delete()
                
                const Log = new MessageEmbed()
                .setColor(message_log_colour)
                .setTitle("Blacklisted word ⚫")
                .setDescription(`${message.author} used a blacklisted word(s).`)
                .addFields(
                    {name: "Message", value: `${message.content}`},
                    {name: "Channel", value: `${message.channel}`},
                )

                const message_logs = client.channels.cache.get(message_logs_id).send({ embeds: [Log] });

              break;
            }
        }      
    }
}
