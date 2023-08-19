const { CommandInteraction, MessageEmbed, Client, Permissions } = require("discord.js");
const toDoListDB = require("../../structures/schemas/toDoListDB");
const toDoListSetupDB = require("../../structures/schemas/toDoListSetupDB");
const { system_embed_colour } = require("../../structures/config.json");

module.exports = {
    name: "to-do-list",
    description: "Create and use a to-do list.",
    usage: "/to-do-list",
    disabled: false,
    options: [
        {
            name: "help",
            description: "View a help embed, showcasing all to-do-list commands.",
            type: "SUB_COMMAND",
        },
        {
            name: "show",
            description: "Show your to-do list.",
            type: "SUB_COMMAND",
        },
        {
            name: "add",
            description: "Add an item to your list.",
            type: "SUB_COMMAND",
            options: [{ name: "item", description: "Provide the item you want to add.", type: "STRING", required: true}]
        },
        {
            name: "remove",
            description: "Remove an item to your list.",
            type: "SUB_COMMAND",
            options: [{ name: "item-number", description: "Provide the item number you want to remove.", type: "INTEGER", required: true}]
        },
        {
            name: "tick",
            description: "Tick off an item from your to-do list.",
            type: "SUB_COMMAND",
            options: [{ name: "item-number", description: "Provide the item number you want to tick off.", type: "INTEGER", required: true}]
        },
        {
            name: "untick",
            description: "Untick an item from your to-do list.",
            type: "SUB_COMMAND",
            options: [{ name: "item-number", description: "Provide the item number you want to tick off.", type: "INTEGER", required: true}]
        },
        {
            name: "tick-all",
            description: "Tick off all items in your to-do list",
            type: "SUB_COMMAND",
        },
        {
            name: "untick-all",
            description: "Untick all items in your to-do list",
            type: "SUB_COMMAND",
        },
        {
            name: "clear",
            description: "Clear your to-do list.",
            type: "SUB_COMMAND",
        },
        {
            name: "clear-ticked",
            description: "Clear ticked off items in your to-do list.",
            type: "SUB_COMMAND",
        },
        {
            name: "clear-unticked",
            description: "Clear unticked off items in your to-do list.",
            type: "SUB_COMMAND",
        },
        {
            name: "refresh",
            description: "Refresh your channel saved to-do-list, if you believe it is incorrect or if the message was deleted.",
            type: "SUB_COMMAND",

        },
        {
            name: "privacy",
            description: "Enable or disable privacy mode.",
            type: "SUB_COMMAND",
            options: [{ name: "option", description: "True = enable, False = disable", type: "BOOLEAN", required: true}]
        },
        {
            name: "add-messages-to-list",
            description: "Set whether messages sent in dedicated to do list channels will be added to the list.",
            type: "SUB_COMMAND",
            options: [{ name: "option", description: "True = enable, False = disable", type: "BOOLEAN", required: true}]
        },
        {
            name: "create-channel",
            description: "Create channel where your to-do list will be saved and updated.",
            type: "SUB_COMMAND",
        },
        {
            name: "delete-channel",
            description: "Delete the channel where your to-do list is saved and updated.",
            type: "SUB_COMMAND",
        },
        {
            name: "set-channel",
            description: "Set a channel where your to-do list will be saved and updated. (Requires MANAGE_CHANNELS)",
            type: "SUB_COMMAND",
            options: [{ name: "channel", description: "Set a channel.", type: "CHANNEL", channelTypes: ["GUILD_TEXT"], required: true}]
        },

    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        async function updateList() {

            var data = await toDoListDB.findOne({ MemberID: interaction.member.id})
                      
            var List = data.List

            var list = ``
    
            if(List.length <= 0) {
                list = "Empty"
            } else {
                for (let i = 0; i < List.length; i++) {
                    list += `\`\`\`${i+1}. ${List[i].name} ${List[i].tickedOff ? "✅" : "☐"}\`\`\`\n`
                  }
            }

            var updatedList = new MessageEmbed()
                .setColor(system_embed_colour)
                .setTitle(`${interaction.member.nickname ? interaction.member.nickname : interaction.member.displayName}'s to-do list`)
                .setDescription(list)

            var channel = await client.channels.cache.get(data.ChannelID)
            
            if(channel) {
                var message = await channel.messages.fetch(data.MessageID).catch((e) => {})
                if(message) 
                    message.edit({embeds: [updatedList]})
            }
        }

        const item = interaction.options.getString("item")
        const itemNumber = interaction.options.getInteger("item-number")
        const option = interaction.options.getBoolean("option")

        const setup = await toDoListSetupDB.findOne({ Guild: interaction.guild.id});

        var data = await toDoListDB.findOne({ MemberID: interaction.member.id})

        if(!data)
            data = await toDoListDB.create({ MemberID: interaction.member.id, List: []})

        var ephemeral;

        if(data.PrivacyMode || data.ChannelID == interaction.channel.id) {
            ephemeral = true
        } else if (!data.PrivacyMode && data.ChannelID != interaction.channel.id) {
            ephemeral = false
        }
        
        var List = data.List

        var list = ``

        if(List.length <= 0) {
            list = "Empty"
        } else {
            for (let i = 0; i < List.length; i++) {
                list += `\`\`\`${i+1}. ${List[i].name} ${List[i].tickedOff ? "✅" : "☐"}\`\`\`\n`
            }
        }

        var listTooLong = false

        if(list.length > 4096) {
            list = ``
            for (let i = 0; i < List.length; i++) {
                list += `\`\`\`${i+1}. ${List[i].name.substring(0, Math.floor(List[i].name / 2))} ${List[i].tickedOff ? "✅" : "☐"}\`\`\`\n`
            }
            listTooLong = true
        }

        const toDoList = new MessageEmbed()
            .setColor(system_embed_colour)
            .setTitle(`${interaction.member.nickname ? interaction.member.nickname : interaction.member.displayName}'s to-do list`)
            .setDescription(list)

        if(listTooLong)
            toDoList.setFooter({text: "Your to-do list is too long, so each item was cut in half. \n\n Please clear unneeded items by using one of the \`/to-do-list clear\` commands."})

        switch(interaction.options.getSubcommand()) {
            case "help":
                const toDoListCommandHelp = new MessageEmbed()
                    .setColor(system_embed_colour)
                    .setTitle(`To-do list system setup help`)
                    .setDescription(
                    `\`•\` **/to-do-list help**: \`Displays this embed.\`` + `\n` +
                    `\`•\` **/to-do-list show**: \`Sends your current to-do list.\`` + `\n` +
                    `\`•\` **/to-do-list add [item]**: \`Adds an item to your to-do list.\`` + `\n` +
                    `\`•\` **/to-do-list remove [item-number]**: \`Removes an item to your to-do list.\`` + `\n` +
                    `\`•\` **/to-do-list tick [item-number]**: \`Tick an item off in your to-do list.\`` + `\n` +
                    `\`•\` **/to-do-list untick [item-number]**: \`Untick an item in your to-do list.\`` + `\n` +
                    `\`•\` **/to-do-list tick-all**: \`Tick off all items in your to-do list.\`` + `\n` +
                    `\`•\` **/to-do-list untick-all**: \`Untick all items in your to-do list.\`` + `\n` + 
                    `\`•\` **/to-do-list clear**: \`Clear all items in your to-do list.\`` + `\n` +
                    `\`•\` **/to-do-list clear-ticked**: \`Clear items which are ticked off in your to-do list.\`` + `\n` + 
                    `\`•\` **/to-do-list clear-unticked**: \`Clear items which are not ticked off in your to-do list.\`` + `\n` + 
                    `\`•\` **/to-do-list refresh**: \`Refresh your to-do list message in your dedicated channel, if it exists, and resend the message if the message was deleted.\`` + `\n` +
                    `\`•\` **/to-do-list privacy [T/F]**: \`Enables or disables privacy mode, which hides all your to-do list messages from other users.\`` + `\n` + 
                    `\`•\` **/to-do-list add-messages-to-list [T/F]**: \`Enables or disables if messages sent in your dedicated to-do list channel are automatically added to the list.\`` + `\n` + 
                    `\`•\` **/to-do-list create-channel**: \`Create a channel in which your to-do list will be sent and updated.\`` + `\n` + 
                    `\`•\` **/to-do-list delete-channel**: \`Delete the channel where your to-do list is saved and updated.\`` + `\n` + 
                    `\`•\` **/to-do-list set-channel**: \`Set a channel in which your to-do list will be sent and updated (Requires MANAGE_CHANNELS)\``
                    )
                return interaction.reply({embeds: [toDoListCommandHelp], ephemeral})
            break;

            case "show":
                return interaction.reply({embeds: [toDoList], ephemeral})
            break;

            case "add":
                List.push({"name": item, "tickedOff": false})
                await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})
        
                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} \`${item}\` has been added to your to-do list.`)], ephemeral})
            break;

            case "remove":
                if(itemNumber < 1 || itemNumber > data.List.length)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This item is not in your list.`)], ephemeral})

                const itemRemoved = List[itemNumber-1]

                List.splice(itemNumber-1, 1)

                await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} \`${itemRemoved.name}\` has been removed from your list.`)], ephemeral})
            break;

            case "tick":
                if(itemNumber < 1 || itemNumber > data.List.length)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This item is not in your list.`)], ephemeral})
                
                if(List[itemNumber-1].tickedOff == true)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} \`${List[itemNumber-1].name}\` has already been ticked off.`)], ephemeral})

                List[itemNumber-1].tickedOff = true
                await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} \`${List[itemNumber-1].name}\` has been ticked off.`)], ephemeral})
            break;

            case "untick":
                if(itemNumber < 1 || itemNumber > data.List.length)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This item is not in your list.`)], ephemeral})

                if(List[itemNumber-1].tickedOff == false)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} \`${List[itemNumber-1].name}\` has not been ticked off.`)], ephemeral})

                List[itemNumber-1].tickedOff = false
                await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} \`${List[itemNumber-1].name}\` has been unticked.`)], ephemeral})
            break;

            case "tick-all":
                for (let i = 0; i < List.length; i++) {
                    List[i].tickedOff = true
                }
                await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})
                
                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} All items in your to-do list have been ticked off.`)], ephemeral})
            break;

            case "untick-all":
                for (let i = 0; i < List.length; i++) {
                    List[i].tickedOff = false
                }
                await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})
                
                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} All items in your to-do list have been unticked.`)], ephemeral})
            break;

            case "clear":
                await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {List: []})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Your list has been cleared.`)], ephemeral})
            break;

            
            case "clear-ticked":
                await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List.filter(item => item.tickedOff == false)})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Ticked off items in your list have been cleared.`)], ephemeral})
            break;

            
            case "clear-unticked":
                await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List.filter(item => item.tickedOff == true)})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Unticked items in your list have been cleared.`)], ephemeral})
            break;

            case "refresh":  
                var data = await toDoListDB.findOne({ MemberID: interaction.member.id})
                        
                var List = data.List

                var list = ``
        
                if(List.length <= 0) {
                    list = "Empty"
                } else {
                    for (let i = 0; i < List.length; i++) {
                        list += `\`\`\`${i+1}. ${List[i].name} ${List[i].tickedOff ? "✅" : "☐"}\`\`\`\n`
                    }
                }

                var updatedList = new MessageEmbed()
                    .setColor(system_embed_colour)
                    .setTitle(`${interaction.member.nickname ? interaction.member.nickname : interaction.member.displayName}'s to-do list`)
                    .setDescription(list)

                var channel = await client.channels.cache.get(data.ChannelID)
                
                if(channel) {
                    var message = await channel.messages.fetch(data.MessageID).catch((e) => {})
                    if(message) {
                        message.edit({embeds: [updatedList]})
                        return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Your to-do list has been refreshed.`)], ephemeral})
                    } else {
                        await channel.send({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription("Setting up to-do list...")]}).then(async (message) => {
                            await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {ChannelID: channel.id, MessageID: message.id})
                            await updateList()
                            return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Your to-do list has successfully been refreshed and resent as the message was previously deleted.`)], ephemeral})
                        })
                    }     
                } else {
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} Your to-do list channel was not found. \n\n Please run \`/to-do list create-channel\` to create a new to-do list channel`)], ephemeral})
                }
            break;

            case "privacy":
                if(option) {
                    await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {PrivacyMode: true})
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Privacy mode has been enabled.`)], ephemeral: true})
                } else {
                    await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {PrivacyMode: false})
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Privacy mode has been disabled.`)], ephemeral: data.ChannelID == interaction.channel.id ? true: false})
                }

            break;

            case "add-messages-to-list":
                if(option) {
                    await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {MessageCreateToAdd: true})
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Messages sent in to dedicated to-do list channels will automatically be added to the list.`)], ephemeral: true})
                } else {
                    await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {MessageCreateToAdd: false})
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Messages sent in to dedicated to-do list channels will no longer automatically be added to the list.`)], ephemeral: data.ChannelID == interaction.channel.id ? true: false})
                }

            break;
            
            case "create-channel":
                if(!setup || setup.CategoryID == "None")
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This server has not set up dedicated to-do list channels.`)], ephemeral})

                var toDoListChannel = client.channels.cache.get(data.ChannelID)

                if(toDoListChannel)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You already have a channel created, please use that instead. \n${toDoListChannel}`)], ephemeral})

                toDoListChannel = await interaction.guild.channels.create(`${interaction.member.nickname ? interaction.member.nickname : interaction.member.displayName}`, {
                    type: "GUILD_TEXT",
                    parent: setup.CategoryID,
                    permissionOverwrites: [
                        {
                            id: client.user.id, 
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"]
                        },
                        {
                            id: interaction.member.id, 
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES", "USE_APPLICATION_COMMANDS"]
                        },
                        {
                            id: interaction.guild.id, 
                            deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                        },
                    ],
                }).catch((e) => {
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} An error occured whilst creating your channel. \n\`\`\`${e}\`\`\``)], ephemeral})
                })

                await toDoListChannel.send({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription("Setting up to-do list...")]}).then(async (message) => {
                    await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {ChannelID: toDoListChannel.id, MessageID: message.id})
                    await updateList()
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Your to-do list has successfully been set up in ${toDoListChannel} `)], ephemeral})
                })

            break;

            case "delete-channel":        
                if(!setup || setup.CategoryID == "None")
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This server has not set up dedicated to-do list channels.`)], ephemeral})

                var toDoListChannel = client.channels.cache.get(data.ChannelID)

                if(!toDoListChannel)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You haven't created a to-do list channel created. Please use \`/to-do-list create-channel\` to create one.`)], ephemeral})

                toDoListChannel.delete().then(() => {
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Your to-do list channel has successfully been deleted.`)], ephemeral})
                })


            break;
            
            case "set-channel":

                if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You need the permission \`MANAGE_CHANNELS\` to set your own channel.`)]});

                var toDoListChannel = client.channels.cache.get(data.ChannelID)

                if(toDoListChannel)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You already have a channel created, please delete that to use a custom channel. \n${toDoListChannel}`)], ephemeral})

                var channel = interaction.options.getChannel("channel");

                try {
                    await channel.send({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription("Setting up to-do list...")]}).then(async (message) => {
                        await toDoListDB.findOneAndUpdate({MemberID: interaction.member.id}, {ChannelID: channel.id, MessageID: message.id})
                        await updateList()
                        return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Your to-do list has successfully been set up in ${channel} `)], ephemeral})
                    })
                } catch (error) {
                    if(error.message === "Missing Access") {
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The bot does not have access to this channel.`)], ephemeral})
                    } else {
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} An error occured. \n\n \`\`\`${error}\`\`\``)], ephemeral})
                    }    
                }      
            break;
        }
    }
}