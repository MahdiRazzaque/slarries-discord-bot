const { Client, MessageEmbed } = require("discord.js");
const DB = require("../structures/schemas/ticketDB");
const ms = require("ms");
const axios = require("axios")
const { createTranscript } = require("discord-html-transcripts");
const { transcripts_channel_id, guildID, ticketCheckChannelID, ticketCheckMessageID } = require("../structures/config.json")

function delay(time) {return new Promise((resolve) => setTimeout(resolve, time))}

/**
 * 
 * @param {Client} client 
 */
module.exports = async(client) => {

    setInterval(async () => {
        let msg = await client.channels.cache.get(ticketCheckChannelID).messages.fetch(ticketCheckMessageID)

        const ticketCheckEmbed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle("Ticket Checks 🚨")

        var openTickets = 0
        var alreadyClosedTickets = 0
        var checkedTickets = 0
        var closedTickets = 0

        var updateDate = Date.now() + ms("300s")
        updateDate = updateDate.toString().slice(0, -3)

        const documentsArray = await DB.find()
            
        documentsArray.forEach(async (data, index) => {
            checkedTickets += 1 

            if(data.Closed) return alreadyClosedTickets += 1
            if(!data.Closed) openTickets += 1

            const guild = client.guilds.cache.get(guildID)
            const members = (guild.members.cache.map(e => e.id))
            
            if(members.includes(data.MembersID[0])) 
                return;

            const ticketChannel = await client.channels.cache.get(data.ChannelID)

            if(!ticketChannel) return;

            const attachment = await createTranscript(ticketChannel, {limit: -1, returnBuffer: false, fileName: `${data.Type} - ${data.TicketID}.html`})
            await DB.updateOne({ ChannelID: ticketChannel.id }, { Closed: true });

            var memberTags = []

            await data.MembersID.forEach(async (member) => {
                var member = await client.users.fetch(member)
                
                if(member) 
                    memberTags.push(member.username)

                if(!member)
                    memberTags.push(`Unknown Member`)
            })     

            const openedMember = await client.users.fetch(data.MembersID[0])
            const claimedMember = await client.users.fetch(data.ClaimedBy).catch(() => {})

            const message = await ticketChannel.send({embeds: [new MessageEmbed().setColor("RED").setDescription(`The member who opened this ticket \`${openedMember ? openedMember.data.tag : "Unknown Member"}\` has left the server. \n\nThis channel will now be deleted in 10 seconds and a transcript will automatically be generated.`)]})

            const transcriptEmbed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`Ticket Closed | ID: ${data.TicketID}`)
            .addFields(
                {name: "Type", value: `${data.Type}`, inline: true},
                {name: "Opened by", value: `\`${openedMember ? openedMember.username : "Unknown Member"}\``, inline: true},
                {name: "Claimed by", value: data.ClaimedBy ? `\`${claimedMember.username}\`` : "`No one claimed this ticket`" , inline: true},
                {name: "Open time", value: `<t:${data.OpenTime}:R>`, inline: true},
                {name: "Closed time", value: `<t:${parseInt(Date.now() / 1000)}:R>`, inline: true},
                {name: "Closed by", value: `\`${memberTags[0]} leaving the server.\``, inline: true},
                {name: "Members", value: `\`${memberTags.join(`\`\n\``)}\``, inline: true},
            )
                
            async function dmMembers(members) {
                members.forEach(async(member) => {
                    var fetchedMember = await guild.members.fetch(member).catch((e) => {})

                    if(fetchedMember)
                        await fetchedMember.send({embeds: [transcriptEmbed.setTitle(`Ticket closed in ${guild.name} | ID: ${data.TicketID}`)], files: [attachment]}).catch((e) => {})
                })
            }
            
            const transcriptChannel = await client.channels.cache.get(transcripts_channel_id)

            const sendTranscript = await transcriptChannel.send({ embeds: [transcriptEmbed.setFooter({text: "The member who created this ticket left the server, so it was closed automatically."})], files: [attachment]}); 

            await delay(10000)
            
            await message.edit({ embeds: [new MessageEmbed().setColor("BLUE").setDescription(`The transcript is now saved [TRANSCRIPT](${sendTranscript.url})`)]});
    
            await dmMembers(data.MembersID)
    
            setTimeout(() => {ticketChannel.delete()}, 10 * 500)
            closedTickets += 1 
        })

        ticketCheckEmbed.addField("ㅤ\nInformation 📖", 
            `\`•\` **Open tickets**: \`${openTickets.toString()}\`` + `\n` +
            `\`•\` **Closed tickets**: \`${alreadyClosedTickets.toString()}\``+ `\nㅤ`)

        ticketCheckEmbed.addField("During last check 🔨", 
            `\`•\` **Checked tickets**: \`${checkedTickets.toString()}\`` + `\n` +
            `\`•\` **Tickets which were closed**: \`${closedTickets.toString()}\`` + `\nㅤ`)

        ticketCheckEmbed.addField("Next check ⌛", `<t:${updateDate}:R>`)
        msg.edit({ embeds: [ticketCheckEmbed], content: " " })
    }, 300 * 1000)
}