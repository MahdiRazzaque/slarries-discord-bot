const { MessageEmbed, Message, Client } = require('discord.js');

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
        if(message.channel.type === "DM") return;
        if(message.guild === null) return;
        if(message.author.bot) return;
        if (message.content.includes('@here') || message.content.includes('@everyone')) return;
        
        if (message.mentions.has(client.user)) 
            return message.reply({ embeds: [new MessageEmbed().setColor("PURPLE").setDescription(`**Hello ${message.author}**\n\n> This bot uses slash commands. \n\n> If you would like to use a command navigate to application commands in discord or type / to see my commands.\n\n> You can also use /help to see my available commands.`)]})
    }
}