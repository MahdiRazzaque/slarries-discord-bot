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
    async execute(interaction) {
        if(!interaction.isButton()) return;
       
        const { guild, customId, channel, member } = interaction;

        if(!["close-ticket", "lock-ticket", "unlock-ticket"].includes(customId)) return;

        if (!member.roles.cache.has("917054077869912177")) {return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("You cannot use these buttons.")], ephemeral: true})};
        
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
                    channel.permissionOverwrites.edit(docs.MemberID, {SEND_MESSAGES: false}, {VIEW_CHANNEL: true})
                    return interaction.reply({ embeds: [Embed] });
                    break;
                case "unlock-ticket":
                    if(docs.Locked == false)
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("This ticket is already unlocked.")], ephemeral: true});
                    await DB.updateOne({ ChannelID: channel.id }, { Locked: false });
                    Embed.setDescription("🔓 | This ticket is now unlocked.")
                    channel.permissionOverwrites.edit(docs.MemberID, {SEND_MESSAGES: true}, {VIEW_CHANNEL: true})
                    return interaction.reply({ embeds: [Embed] });
                    break;
                case "close-ticket":
                    if(docs.Closed == true)
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("This ticket is already closed, please wait for it to get deleted.")], ephemeral: true});
                    const attachment = await createTranscript(channel, {limit: -1, returnBuffer: false, fileName: `${docs.Type} - ${docs.TicketID}.html`})
                    await DB.updateOne({ ChannelID: channel.id }, { Closed: true });

                    const MEMBER = guild.members.cache.get(docs.MemberID);
                    const Message = await guild.channels.cache.get(transcripts_channel_id).send({ embeds: [Embed.setAuthor(MEMBER.user.tag, MEMBER.user.displayAvatarURL({ dynamic: true })).setTitle(`Transcript type: ${docs.Type}\nID: ${docs.TicketID}`)], files: [attachment]});

                    interaction.reply({ embeds: [Embed.setDescription(`The transcript is now saved [TRANSCRIPT](${Message.url})`)]});
                    
                    const dmEmbed = new MessageEmbed().setColor("DARK_AQUA").setTitle(`Your ticket was closed in ${guild.name}`).addFields({name: "Transcript Type", value: `${docs.Type}`, inline: true}, {name: "Ticket ID", value: `${docs.TicketID}`, inline: true})
                    MEMBER.send({embeds: [dmEmbed], files: [attachment]})
                    
                    setTimeout(() => {channel.delete()}, 10 * 1000)
            }
        });
    }
}