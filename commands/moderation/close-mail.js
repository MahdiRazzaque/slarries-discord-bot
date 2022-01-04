const modmailClient = require("../../events/modMail/modmail");
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "close-mail",
    description: "close the mail",
    usage: "/close-mail",
    disabled: false,
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
        if (!interaction.member.roles.cache.has("920027065133187094")) {return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("<a:animated_cross:925091847905366096> You need the <@&920027065133187094> role to use this command.")], ephemeral: true})};

        const reason = interaction.options.getString("reason");
        modmailClient.deleteMail({
            channel: interaction.channel.id,
            reason
        })
    }
}