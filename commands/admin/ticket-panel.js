const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const { open_ticket_channel, ticket_panel_colour, ticket_panel_disabled } = require("../../structures/config.json");

module.exports = {
    name: "ticket-panel",
    description: "Setup your ticketing message.",
    usage: "/ticket-panel",
    permission: "ADMINISTRATOR",
    /**
    * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        if(ticket_panel_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setDescription("<a:animated_cross:925091847905366096> **Command Disabled**")], ephemeral: true})};

        const { guild } = interaction;

        const Embed = new MessageEmbed()
            .setAuthor(guild.name + " | Ticketing System", guild.iconURL({dynamic: true}))
            .setTitle('__**How to buy carries**__')
            .setDescription(
                "> Press the button below to create a ticket.\n \n" +

                "> Once the ticket is made, please follow the intructions in that channel. \n \n" +

                "> *For slayer carries Please get the kills before opening a ticket*"
            )
            .setColor(ticket_panel_colour)
        
        const Buttons = new MessageActionRow();
        Buttons.addComponents(
            new MessageButton()
            .setCustomId("slayer-ticket")
            .setLabel("Slayer Carry")
            .setStyle("PRIMARY")
            .setEmoji("<:Maddox_Batphone:922918383094214697>"),
            new MessageButton()
            .setCustomId("dungeon-ticket")
            .setLabel("Dungeon Carry")
            .setStyle("SECONDARY")
            .setEmoji("<:mort:922923214647226380>")
        )

        await guild.channels.cache.get(open_ticket_channel).send({embeds: [Embed], components: [Buttons]});

        interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("<a:animated_tick:925091839030231071> Ticket panel has been sent.")], ephemeral: true})
    }
}