const { GuildMember, MessageEmbed, Client } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const { transcripts_channel_id, ticket_enabled } = require("../../structures/config.json");
const DB = require("../../structures/schemas/ticketDB");

function delay(time) {return new Promise((resolve) => setTimeout(resolve, time))}

module.exports = {
    name: "guildMemberRemove",
    /**
     * 
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client) {

        return; 
        const data = await DB.findOne({ "MembersID.0": member.id})

        if(!data) return;

        const ticketChannel = await member.guild.channels.fetch(data.ChannelID).then((channel) => {console.log(channel)})

        console.log(ticketChannel)

        if(!ticketChannel) return;

        const message = await ticketChannel.send({embeds: [new MessageEmbed().setColor("RED").setDescription(`The member who opened this ticket \`${member.user.tag}\` has left the server. \n\nThis channel will now be deleted in 10 seconds and a transcript will automatically be generated.`)]})

        const attachment = await createTranscript(ticketChannel, {limit: -1, returnBuffer: false, fileName: `${data.Type} - ${data.TicketID}.html`})
        await DB.updateOne({ ChannelID: ticketChannel.id }, { Closed: true });

        var memberTags = []

        await data.MembersID.forEach(async (member) => {
            var member = await ticketChannel.guild.members.fetch(member)
            
            if(member)
                memberTags.push(`${member.user.tag}`)
        })

        const transcriptEmbed = new MessageEmbed()
        .setColor("BLUE")
        .setTitle(`Ticket Closed | ID: ${data.TicketID}`)
        .addFields(
            {name: "Type", value: `${data.Type}`, inline: true},
            {name: "Opened by", value: `\`${member.user.tag}\``, inline: true},
            {name: "Claimed by", value: data.ClaimedBy ? `<@!${data.ClaimedBy}>` : "`No one claimed this ticket`" , inline: true},
            {name: "Open time", value: `<t:${data.OpenTime}:R>`, inline: true},
            {name: "Closed time", value: `<t:${parseInt(Date.now() / 1000)}:R>`, inline: true},
            {name: "Closed by", value: `\`${member.user.tag} left the server\``, inline: true},
            {name: "Members", value: `\`${memberTags.join(`\`\n\``)}\``, inline: true},
        )
            
        async function dmMembers(members) {
            members.forEach(async(member) => {
                var fetchedMember = await ticketChannel.guild.members.fetch(member)

                if(fetchedMember)
                    await fetchedMember.send({embeds: [transcriptEmbed.setTitle(`Ticket closed in ${ticketChannel.guild.name} | ID: ${data.TicketID}`)], files: [attachment]}).catch((e) => {})
            })
        }

        const sendTranscript = await member.guild.channels.fetch(transcripts_channel_id).send({ embeds: [transcriptEmbed.setFooter({text: "The member who created this ticket left the server, so it was closed automatically."})], files: [attachment]}); 
        
        await message.edit({ embeds: [new MessageEmbed().setColor("BLUE").setDescription(`The transcript is now saved [TRANSCRIPT](${sendTranscript.url})`)]});

        await dmMembers(data.MembersID)

        setTimeout(() => {ticketChannel.delete()}, 10 * 500) 
    }
}