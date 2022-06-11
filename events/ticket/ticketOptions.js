const { ButtonInteraction, MessageEmbed } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const { transcripts_channel_id, ticket_enabled } = require("../../structures/config.json");
const DB = require("../../structures/schemas/ticketDB");

function delay(time) {return new Promise((resolve) => setTimeout(resolve, time))}

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {
        if(!interaction.isButton()) return;
       
        const { guild, customId, channel, member } = interaction;

        if(!["close-ticket", "lock-ticket", "unlock-ticket", "claim-ticket"].includes(customId)) return;

        if (!member.roles.cache.has("917054077869912177") && !member.roles.cache.has("925013507546693632")) {return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("You cannot use these buttons.")], ephemeral: true})};
        
        if(!ticket_enabled) return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("Tickets are currently disabled.")], ephemeral: true})

        const Embed = new MessageEmbed().setColor("BLUE");

        const data = await DB.findOne({ ChannelID: channel.id })

        if(!data) return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("No data related to this ticket was found, please delete this ticket manually.")], ephemeral: true})
        
        switch(customId) {
            case "lock-ticket" :
                if(data.Locked == true)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("This ticket is already locked.")], ephemeral: true});
                await DB.updateOne({ ChannelID: channel.id }, { Locked: true });
                Embed.setDescription("🔒 | This ticket is now locked.")
                data.MembersID.forEach((m) => {
                    channel.permissionOverwrites.edit(m, {SEND_MESSAGES: false}, {VIEW_CHANNEL: true})  
                })
                return interaction.reply({ embeds: [Embed] });
                break;
            case "unlock-ticket":
                if(data.Locked == false)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("This ticket is already unlocked.")], ephemeral: true});
                await DB.updateOne({ ChannelID: channel.id }, { Locked: false });
                Embed.setDescription("🔓 | This ticket is now unlocked.")
                data.MembersID.forEach((m) => {
                    channel.permissionOverwrites.edit(m, {SEND_MESSAGES: true}, {VIEW_CHANNEL: true})  
                })
                return interaction.reply({ embeds: [Embed] });
                break;
            case "close-ticket":
                if(data.Closed == true)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("This ticket is already closed, please wait for it to get deleted.")], ephemeral: true});

                const attachment = await createTranscript(channel, {limit: -1, returnBuffer: false, fileName: `${data.Type} - ${data.TicketID}.html`})
                await DB.updateOne({ ChannelID: channel.id }, { Closed: true });

                var memberTags = []

                await data.MembersID.forEach(async (member) => {
                    var member = await interaction.guild.members.fetch(member)
                    
                    if(member)
                        memberTags.push(`${member.user.tag}`)
                })

                const transcriptEmbed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`Ticket Closed | ID: ${data.TicketID}`)
                .addFields(
                    {name: "Type", value: `${data.Type}`, inline: true},
                    {name: "Opened by", value: `<@!${data.MembersID[0]}>`, inline: true},
                    {name: "Claimed by", value: data.ClaimedBy ? `<@!${data.ClaimedBy}>` : "`No one claimed this ticket`" , inline: true},
                    {name: "Open time", value: `<t:${data.OpenTime}:R>`, inline: true},
                    {name: "Closed time", value: `<t:${parseInt(Date.now() / 1000)}:R>`, inline: true},
                    {name: "Closed by", value: `\`${interaction.member.user.tag}\``, inline: true},
                    {name: "Members", value: `\`${memberTags.join(`\`\n\``)}\``, inline: true},
                )
                    
                async function dmMembers(members) {
                    members.forEach(async(member) => {
                        var fetchedMember = await interaction.guild.members.fetch(member)

                        if(fetchedMember)
                            await fetchedMember.send({embeds: [transcriptEmbed.setTitle(`Ticket closed in ${interaction.guild.name} | ID: ${data.TicketID}`)], files: [attachment]}).catch((e) => {})
                    })
                }
    
                try {

                    const reply = await interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setDescription("Closing ticket")], fetchReply: true})

                    const sendTranscript = await guild.channels.cache.get(transcripts_channel_id).send({ embeds: [transcriptEmbed], files: [attachment]}); 
                    
                    await reply.edit({ embeds: [Embed.setDescription(`The transcript is now saved [TRANSCRIPT](${sendTranscript.url})`)]});

                    await dmMembers(data.MembersID)
                
                    setTimeout(() => {channel.delete()}, 10 * 500)
                } catch (e) {
                    await interaction.channel.send({embeds: [new MessageEmbed().setColor("RED").setDescription("An error occurred. \n\n This channel will now be deleted in 10 seconds and a transcript will automatically be generated.")]});
                    await guild.channels.cache.get(transcripts_channel_id).send({ embeds: [transcriptEmbed.setFooter({text: "This ticket failed to close, so it was closed automatically."})], files: [attachment]});
                    await dmMembers(data.MembersID)
                    setTimeout(() => {channel.delete()}, 10 * 1000)    
                }
                break;
            case "claim-ticket":
                if(data.Claimed == true) 
                    return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`This ticket has already been claimed by <@${data.ClaimedBy}>`)], ephemeral: true});

                await DB.updateOne({ChannelID: channel.id}, {Claimed: true, ClaimedBy: interaction.member.id});

                Embed.setDescription(`🛄 This ticket has now been claimed by ${interaction.member}`)
                interaction.reply({embeds: [Embed]})
        }
    }
}