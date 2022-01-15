const { Client, Message, MessageEmbed } = require("discord.js");
const { modMail_enabled } = require("../../structures/config.json")
const modmailClient = require("./modmail")

module.exports = {
    name: "messageCreate",
    execute(message, client) {
        if(!modMail_enabled) return;
        modmailClient.modmailListener(message)
    }
}