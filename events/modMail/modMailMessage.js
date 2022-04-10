const { Client, Message, MessageEmbed } = require("discord.js");
const { Prefix } = require("../../structures/config.json");
const modmailClient = require("./modmail")

module.exports = {
    name: "messageCreate",
    disabled: false,
    execute(message, client) {
        if (message.content.startsWith(Prefix) || message.author.bot) return;        
        modmailClient.modmailListener(message)
    }
}