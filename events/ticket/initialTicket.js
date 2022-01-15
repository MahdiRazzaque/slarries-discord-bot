const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const DB = require("../../structures/schemas/ticketDB");
const { parent_id, everyone_id, open_ticket_embed_colour, ticket_enabled, unverified_id } = require("../../structures/config.json");

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
        //if (customId === "slayer-ticket") return interaction.reply({embeds: [new MessageEmbed().setDescription("Slayer carries are not currently available").setColor("RED")], ephemeral: true})

        let ticketChannel = (interaction.guild.channels.cache.find(c => c.name.toLowerCase().includes(member.id)))
        if (ticketChannel) {return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`You have already created a ticket. \n Please finish and complete this carry before requesting another. ${ticketChannel}`)], ephemeral: true})}

        const ID = Math.floor(Math.random() * 90000) + 10000;

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
                .setEmoji("🔓"),
            new MessageButton()
                .setCustomId("claim-ticket")
                .setLabel("Claim")
                .setStyle("PRIMARY")
                .setEmoji("🛄")
        )

        const Embed = new MessageEmbed()

        switch (customId) {
            case "slayer-ticket":
                var helperRoleId = "917054077869912177"

                Embed.setAuthor({name: `${guild.name} | TicketID: ${ID}`, iconURL: guild.iconURL({dynamic:true})})
                Embed.setTitle(`Hello and welcome to your slayer carrying service.`)
                Embed.setDescription(`**A <@&917054077869912177> will be with you shortly.** \n \n While you wait please follow the following for requesting your carry: \n> IGN: \n> Slayer which you want killed: \n> Number of bosses: \n> If you need to borrow goblin armour and wither cloak sword:`)
                Embed.addFields(
                    {name: "💰 Prices", value: "<#917056569353580584>", inline: true},
                    {name: "🏕 How to survive", value: "<#917063326587031603>", inline: true},
                    {name: "❔ Frequent Questions", value: "<#917073516677967903>", inline: true}
                )
                Embed.setFooter({text: "The buttons below are staff only buttons."})
                Embed.setColor(open_ticket_embed_colour)
                Embed.setTimestamp()
                break;
            case "dungeon-ticket":
                var helperRoleId = "925013507546693632"
                Embed.setAuthor({name: `${guild.name} | TicketID: ${ID}`, iconURL: guild.iconURL({dynamic:true})})
                Embed.setDescription("This is a dungeon ticket (WIP)!")
                Embed.setFooter({text: "The buttons below are staff only buttons."})
                Embed.setColor(open_ticket_embed_colour)

        }
        await guild.channels.create(`${customId + "-" + ID + "-" + interaction.user.id}`, {
            type: "GUILD_TEXT",
            parent: parent_id,
            permissionOverwrites: [
                {
                    id: helperRoleId,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                },
                {
                    id: member.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                },
                {
                    id: everyone_id, 
                    deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                },
                {
                    id: unverified_id,
                    deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                },
            ],
        })
        .then(async(channel) => {
            await DB.create({ GuildID: guild.id, MembersID: member.id, TicketID: ID, ChannelID: channel.id, Closed: false, Locked: false, Type: customId, Claimed: false })

            channel.send({content: `Welcome <@${interaction.user.id}> ||<@&${helperRoleId}>||`, embeds: [Embed], components: [Buttons]})

            // await channel.send({content: `${member} here is your ticket.`}).then((m) => {
            //     setTimeout(() => {
            //         m.delete().catch(() => {})
            //     }, 1 * 10000)
            // })

            interaction.reply({embeds: [new MessageEmbed().setDescription(`${member} your ticket has been created: ${channel}`).setColor("GREEN")], ephemeral: true})
        })
    }
}