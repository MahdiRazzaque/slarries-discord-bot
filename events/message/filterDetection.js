const { Message, MessageEmbed, Client } = require("discord.js");
const { message_log_colour } = require("../../structures/config.json")

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        if(message.author.bot || !message.guild) return;
        const { content, guild, author, channel } = message;

        //const messageContent = content.toLowerCase().split(" ");

        const Filter = client.filters.get(guild.id);
        if(!Filter) return;

        const wordsUsed = [];
        let shouldDelete = false;

        // messageContent.forEach((word) => {
        //     if(Filter.includes(word)) {
        //         wordsUsed.push(word);
        //         shouldDelete = true
        //     }
        // });

        for (var i = 0; i < Filter.length; i++) {
            if (message.content.toLowerCase().includes(Filter[i])) {
                wordsUsed.push(Filter[i]);
                shouldDelete = true
            }
        }

        if(shouldDelete) {
            message.delete().catch(() => {});
        }

        if (wordsUsed.length) {
            const channelID = client.filtersLog.get(guild.id);
            if(!channelID) return;
            const channelObject = guild.channels.cache.get(channelID);
            if(!channelObject) return;

            await message.channel.send({content: `${message.author}`, embeds: [new MessageEmbed().setColor("RED").setTitle("Blacklisted Word(s)").setDescription(`${message.author} please do not use that word(s) as it is included in this server's blacklisted words.`).addField("Blacklisted Word", `\`\`\`${wordsUsed.map((w) => w).join(", ")}\`\`\``)]})
            .then((m) => {setTimeout(() => {m.delete().catch(() => {})}, 1 * 5000)})
            
            const Embed = new MessageEmbed()
            .setColor(message_log_colour)
            .setTitle("Blacklisted word ⚫")
            .setAuthor({name: author.tag, iconURL: author.displayAvatarURL({ dynamic: true })})
            .setDescription(`${message.author} used ${wordsUsed.length} blacklisted word(s).`)
            .addFields(
                {name: "Blacklisted word(s)", value: `${wordsUsed.map((w) => w).join(", ")}`},
                {name: "Message", value: `${message.content}`},
                {name: "Channel", value: `${message.channel}`},
            )

                channelObject.send({ embeds: [Embed]});
        }       
    }
}