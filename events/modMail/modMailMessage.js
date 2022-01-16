const { Client, Message, MessageEmbed } = require("discord.js");
const modmailClient = require("./modmail")

module.exports = {
    name: "messageCreate",
    disabled: false,
    execute(message, client) {
        modmailClient.modmailListener(message)
    }
}