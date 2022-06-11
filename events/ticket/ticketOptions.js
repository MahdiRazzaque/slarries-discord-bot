const { ButtonInteraction, MessageEmbed } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const { transcripts_channel_id, ticket_enabled } = require("../../structures/config.json");
const DB = require("../../structures/schemas/ticketDB");

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

        DB.findOne({ ChannelID: channel.id }, async(err, docs) => {
            if(err) throw err;
            if(!docs) return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("No data related to this ticket was found, please delete this ticket manually.")], ephemeral: true})
            
            switch(customId) {
                case "lock-ticket" :
                    if(docs.Locked == true)
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("This ticket is already locked.")], ephemeral: true});
                    await DB.updateOne({ ChannelID: channel.id }, { Locked: true });
                    Embed.setDescription("🔒 | This ticket is now locked.")
                    docs.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, {SEND_MESSAGES: false}, {VIEW_CHANNEL: true})  
                    })
                    return interaction.reply({ embeds: [Embed] });
                    break;
                case "unlock-ticket":
                    if(docs.Locked == false)
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("This ticket is already unlocked.")], ephemeral: true});
                    await DB.updateOne({ ChannelID: channel.id }, { Locked: false });
                    Embed.setDescription("🔓 | This ticket is now unlocked.")
                    docs.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, {SEND_MESSAGES: true}, {VIEW_CHANNEL: true})  
                    })
                    return interaction.reply({ embeds: [Embed] });
                    break;
                case "close-ticket":
                    if(docs.Closed == true)
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("This ticket is already closed, please wait for it to get deleted.")], ephemeral: true});
                    const attachment = await createTranscript(channel, {limit: -1, returnBuffer: false, fileName: `${docs.Type} - ${docs.TicketID}.html`})
                    await DB.updateOne({ ChannelID: channel.id }, { Closed: true });

                    
                    try {

                      const reply = await interaction.reply({embeds: [new MessageEmbed().setColour("BLUE").setDescription("Closing ticket")], fetchReply: true})

                        var claimedBy

                        if(!docs.ClaimedBy) {
                            claimedBy = "No one claimed this ticket."
                        } else {
                            claimedBy = `<@!${docs.ClaimedBy}>`
                        }

                        const transcriptEmbed = new MessageEmbed()
                            .setColor("BLUE")
                            .setTitle("Ticket Closed")
                            .addFields(
                                {name: "Ticket ID", value: `${docs.TicketID}`, inline: true},
                                {name: "Type", value: `${docs.Type}`, inline: true},
                                {name: "Claimed by", value: `${claimedBy}`, inline: true},
                                {name: "Open time", value: `<t:${docs.OpenTime}:R>`, inline: true},
                                {name: "Closed time", value: `<t:${parseInt(Date.now() / 1000)}:R>`, inline: true},
                                {name: "Opened by", value: `<@!${docs.MembersID[0]}>`, inline: true},
                                {name: "Members", value: `<@!${docs.MembersID.map(m => m).join(">, <@!")}>`, inline: true},
                            )

                        const Message = await guild.channels.cache.get(transcripts_channel_id).send({ embeds: [transcriptEmbed], files: [attachment]}); 
                        
                        await reply.edit({ embeds: [Embed.setDescription(`The transcript is now saved [TRANSCRIPT](${Message.url})`)]});

                        for (var i = 0; i < docs.MembersID.length; i++) {
                            var member = client.users.cache.get(docs.MembersID[i]);

                            member.send({embeds: [transcriptEmbed.setTitle(`Ticket closed in ${interaction.guild.name}`)], files: [attachment]}).catch((e) => {})
                        }
                    
                        setTimeout(() => {channel.delete()}, 10 * 500)
                    } catch (e) {
                        interaction.channel.send({embeds: [new MessageEmbed().setColor("RED").setDescription("An error occurred (Most likely the member left). \n\n This channel will now be deleted in 10sec and a transcript will automatically be generated.")]});
                        await guild.channels.cache.get(transcripts_channel_id).send({ embeds: [transcriptEmbed.setFooter({text: "This ticket failed to close, so it was closed automatically."})], files: [attachment]});
                        setTimeout(() => {channel.delete()}, 10 * 1000)    
                    }
                    break;
                case "claim-ticket":
                    if(docs.Claimed == true) 
                        return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`This ticket has already been claimed by <@${docs.ClaimedBy}>`)], ephemeral: true});

                    await DB.updateOne({ChannelID: channel.id}, {Claimed: true, ClaimedBy: interaction.member.id});

                    Embed.setDescription(`🛄 This ticket has now been claimed by ${interaction.member}`)
                    interaction.reply({embeds: [Embed]})
            }
        });
    }
}