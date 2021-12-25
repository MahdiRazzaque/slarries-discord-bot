const { ModMailClient } = require("reconlx");
const { MessageEmbed } = require("discord.js")
const client = require("../../structures/bot")

const modmailClient = new ModMailClient({
    client,
    guildId: "916385872356733000",
    category: "920027201032847361",
    modmailRole: "920027065133187094",
    mongooseConnectionString: "mongodb+srv://M4HD1:TyDhMZrZi0DU2COO@slarries.ecpjy.mongodb.net/slarries?retryWrites=true&w=majority",
    transcriptChannel: "920027376795136030",
    custom: {
        user: (user) => {
            return {embeds: [new MessageEmbed().setTitle("Modmail").setDescription(`Hi ${user}. \n \n> By DMing me you have created a modmail with the staff of Slarries. \n \n> Please wait as someone will come to assist you.`).setColor("LUMINOUS_VIVID_PINK")]}
        },
        channel: (user) => {
            return {
                content: "<@&920027065133187094>",
                embeds: [new MessageEmbed().setTitle("Modmail").setDescription(`${user} has opened a modmail.`).setColor("LUMINOUS_VIVID_PINK")]
            }
        },
        embedColor: "LUMINOUS_VIVID_PINK"
        
    }
});

module.exports = modmailClient;