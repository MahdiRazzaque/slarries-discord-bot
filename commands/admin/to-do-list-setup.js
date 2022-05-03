const { CommandInteraction, MessageEmbed, Client, Permissions } = require("discord.js");
const DB = require("../../structures/schemas/toDoListSetupDB");

module.exports = {
    name: "to-do-list-setup",
    description: "Manage this server's to-do-list command.",
    usage: "/to-do-list",
    userPermissions: ["ADMINISTRATOR"],
    options: [
        {
            name: "help",
            description: "View a help embed, showcasing all to-do-list-setup commands.",
            type: "SUB_COMMAND",
        },
        {
            name: "set-category",
            description: "Set a channel where to-do list channels will be created.",
            type: "SUB_COMMAND",
            options: [{ name: "category", description: "Set a channel.", type: "CHANNEL", channelTypes: ["GUILD_CATEGORY"], required: true}]
        },
        {
            name: "current-category",
            description: "View the current category.",
            type: "SUB_COMMAND",
        },
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        var data = await DB.findOne({ Guild: interaction.guild.id});

        if(!data)
            data = await DB.create({GuildID: interaction.guild.id, CategoryID: "None", WhitelistedRoles: [], BlacklistedRoles: [], Disabled: false});

        switch(interaction.options.getSubcommand()) {
            case "help":
                const toDoListCommandHelp = new MessageEmbed()
                    .setColor("AQUA")
                    .setTitle(`To-do list system setup help`)
                    .setDescription(
                    `\`•\` **/to-do-list-setup help**: \`Displays this embed.\`` + `\n` +
                    `\`•\` **/to-do-list set-category [channel]**: \`Set the category where to-do list channels will be created.\`` + `\n` +
                    `\`•\` **/to-do-list current-category**: \`Shows the current category where to-do list channels are created.\`` + `\n` +
                    `\`•\` **/to-do-list dedicated-channel [T/F]**: \`Allows you to enable or disable users being able to create dedicated to-do list channels. WIP\`` + `\n` +
                    `\`•\` **/to-do-list whitelist [role]**: \`Whitelist a role so only they can create dedicated to-do list channels. WIP\`` + `\n` +
                    `\`•\` **/to-do-list blacklist [role]**: \`Blacklist a role so they can't create dedicated to-do list channels. WIP\`` + `\n`
                    )
                return interaction.reply({embeds: [toDoListCommandHelp]})
            case "set-category":
                const channel = interaction.options.getChannel("category");

                if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`❌ I need the permission \`MANAGE_CHANNELS\` to create to do list channels.`)]})

                var reply = await interaction.reply({embeds: [new MessageEmbed().setColor("AQUA").setDescription(`Attempting to setup to do list channels in \`${channel.name}\``)], fetchReply: true})

                try {
                    
                    const testChannel = await interaction.guild.channels.create(`Test channel`, {
                        type: "GUILD_TEXT",
                        parent: channel.id,
                        permissionOverwrites: [
                            {
                                id: client.user.id, 
                                allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"]
                            },
                            {
                                id: interaction.guild.id, 
                                deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                            },
                        ],
                    }).then((channel) => {
                        setTimeout(async () => {
                            await channel.delete()
                        }, 3000)
                    }) 
                    
                    await DB.findOneAndUpdate({GuildID: interaction.guild.id}, {CategoryID: channel.id})

                    return reply.edit({embeds: [new MessageEmbed().setColor("AQUA").setDescription(`✅ The category in which to-do list channels will be created has been set to \`${channel.name}\``)]})
                } catch (error) {
                    return reply.edit({embeds: [new MessageEmbed().setColor("RED").setDescription(`❌ An error occured.\n \`\`\`${error}\`\`\``)]})
                }
            break;
            
            case "current-category":
                if(data.CategoryID == "None") {
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`❌ The category currently not setup.`)]})

                } else {
                    const category = client.channels.cache.get(data.CategoryID)

                    return interaction.reply({embeds: [new MessageEmbed().setColor("AQUA").setDescription(`✅ The category currently set to \`${category.name}\``)]})
                }
            break;
        }
    }
}