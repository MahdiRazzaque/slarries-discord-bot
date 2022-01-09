const { MessageEmbed, CommandInteraction } = require("discord.js");
const DB = require("../../structures/schemas/ticketDB");
const { system_embed_colour } = require("../../structures/config.json")

module.exports = {
    name: "ticket",
    description: "Ticket actions.",
    permission: "ADMINISTRATOR",
    usage: "/ticket",
    roles: ["917054077869912177", "925013507546693632"],
    options: [
        {
            name: "action",
            type: "STRING",
            description: "Add or remove a member from this ticket.",
            required: true,
            choices: [
                { name: "Add", value: "add" },
                { name: "Remove", value: "remove" }
            ],
        },
        {
            name: "member",
            description: "Select a member",
            type: "USER",
            required: true
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interacion 
     */
    async execute(interaction) {
        const { guildId, options, channel } = interaction;

        const Action = options.getString("action");
        const Member = options.getMember("member");

        const Embed = new MessageEmbed()

        switch (Action) {
            case "add":
                DB.findOne({ GuildID: guildId, ChannelID: channel.id }, async (err, docs) => {
                    if (err) throw err;
                    if (!docs) return interaction.reply({ embeds: [Embed.setColor("RED").setDescription("<a:animated_cross:925091847905366096> This channel is not tied with a ticket.")], ephemeral: true})
                    
                    if(docs.MembersID.includes(Member.id)) return interaction.reply({ embeds: [Embed.setColor("RED").setDescription("<a:animated_cross:925091847905366096> This member is already part of this ticket.")], ephemeral: true})
                    
                    docs.MembersID.push(Member.id)

                    channel.permissionOverwrites.edit(Member.id, {SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true})

                    interaction.reply({ embeds: [Embed.setColor(system_embed_colour).setDescription(`<a:animated_tick:925091839030231071> ${Member} has been added to this ticket.`)]})

                    docs.save()
                })
                break;
            case "remove":
                DB.findOne({ GuildID: guildId, ChannelID: channel.id }, async (err, docs) => {
                    if (err) throw err;
                    if (!docs) return interaction.reply({ embeds: [Embed.setColor("RED").setDescription("<a:animated_cross:925091847905366096> This channel is not tied with a ticket.")], ephemeral: true})
                    
                    if(!docs.MembersID.includes(Member.id)) return interaction.reply({ embeds: [Embed.setColor("RED").setDescription("<a:animated_cross:925091847905366096> This member is not part of this ticket.")], ephemeral: true})
                    
                    docs.MembersID.remove(Member.id)

                    channel.permissionOverwrites.edit(Member.id, {VIEW_CHANNEL: false})

                    interaction.reply({ embeds: [Embed.setColor(system_embed_colour).setDescription(`<a:animated_tick:925091839030231071> ${Member} has been removed to this ticket.`)]})

                    docs.save()
                })
                break;
        }
    }
}