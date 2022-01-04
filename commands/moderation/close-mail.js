const modmailClient = require("../../events/modMail/modmail");
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "close-mail",
    description: "close the mail",
    usage: "/close-mail",
    disabled: false,
    roles: ["920027065133187094"],
    options: [
        {
            name: "reason",
            description: "What is the reason for closing this mail.",
            type: "STRING",
            required: true
        },
    ],
    /**
    *
    * @param {CommandInteraction} interaction
    */
    async execute (interaction, client) {
        const reason = interaction.options.getString("reason");
        modmailClient.deleteMail({
            channel: interaction.channel.id,
            reason
        })
    }
}