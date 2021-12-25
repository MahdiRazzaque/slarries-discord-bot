const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const DB = require("../../structures/schemas/ticketDB");
const { parent_id, everyone_id, open_ticket_embed_colour, ticket_enabled } = require("../../structures/config.json");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        if(!interaction.isButton()) return;
        
        const { guild, member, customId } = interaction

        if(!["slayer-ticket", "dungeon-ticket"].includes(customId)) return;
        
        if(!ticket_enabled) return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("Tickets are currently disabled.")], ephemeral: true})
        if (customId === "dungeon-ticket") return interaction.reply({embeds: [new MessageEmbed().setDescription("Dungeon carries are not currently available").setColor("RED")], ephemeral: true})

        let ticketChannel = (interaction.guild.channels.cache.find(c => c.name.toLowerCase().includes(member.id)))
        if (ticketChannel) {return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`You have already created a ticket. \n Please use ${ticketChannel}`)], ephemeral: true})}

        const ID = Math.floor(Math.random() * 90000) + 10000;

        await guild.channels.create(`${customId + "-" + ID + "-" + interaction.user.id}`, {
            type: "GUILD_TEXT",
            parent: parent_id,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                },
                {
                    id: everyone_id,
                    deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                },
            ],
        })
        .then(async(channel) => {
            await DB.create({
                GuildID: guild.id,
                MemberID: member.id,
                TicketID: ID,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: customId
            })

            const Embed = new MessageEmbed()
            let slayerCarrier = interaction.guild.roles.cache.get("917054077869912177");

            switch (customId) {
                case "slayer-ticket":
                        Embed.setAuthor(`${guild.name} | Ticket: ${ID}`, guild.iconURL({dynamic:true}))
                        Embed.setTitle(`Hello and welcome to your slayer carrying service.`)
                        Embed.setDescription(`**A ${slayerCarrier} will be with you shortly.** \n \n While you wait please follow the following for requesting your carry: \n> IGN: \n> Slayer which you want killed: \n> Number of bosses:`)
                        Embed.addFields(
                            {name: "💰 Prices", value: "<#917056569353580584>", inline: true},
                            {name: "🏕 How to survive", value: "<#917063326587031603>", inline: true},
                            {name: "❔ Frequent Questions", value: "<#917073516677967903>", inline: true}
                        )
                        Embed.setFooter("The buttons below are staff only buttons.")
                        Embed.setColor(open_ticket_embed_colour)
                        Embed.setTimestamp()
                    break;
                case "dungeon-ticket":
                        Embed.setAuthor(`${guild.name} | Ticket: ${ID}`, guild.iconURL({dynamic:true}))
                        Embed.setDescription("This is a ticket!")
                        Embed.setFooter("The buttons below are staff only buttons.")
                        Embed.setColor(open_ticket_embed_colour)
                    break;
            }
            


            const Buttons = new MessageActionRow()
            Buttons.addComponents(
                new MessageButton()
                    .setCustomId("close-ticket")
                    .setLabel("Save & Close Ticket")
                    .setStyle("PRIMARY")
                    .setEmoji("💾"),
                new MessageButton()
                    .setCustomId("lock-ticket")
                    .setLabel("Lock")
                    .setStyle("SECONDARY")
                    .setEmoji("🔒"),
                new MessageButton()
                    .setCustomId("unlock-ticket")
                    .setLabel("Unlock")
                    .setStyle("SUCCESS")
                    .setEmoji("🔓")
            )

            channel.send({embeds: [Embed], components: [Buttons]})

            await channel.send({content: `${member} here is your ticket.`}).then((m) => {
                setTimeout(() => {
                    m.delete().catch(() => {})
                }, 1 * 10000)
            })

            interaction.reply({embeds: [new MessageEmbed().setDescription(`${member} your ticket has been created: ${channel}`).setColor("GREEN")], ephemeral: true})
            })

    }
}