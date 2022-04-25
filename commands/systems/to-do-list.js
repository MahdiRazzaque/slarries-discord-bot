const { CommandInteraction, MessageEmbed, Client, Message } = require("discord.js");
const DB = require("../../structures/schemas/toDoListDB");
const { system_embed_colour } = require("../../structures/config.json");

module.exports = {
    name: "to-do-list",
    description: "Create and use a to-do list.",
    usage: "/to-do-list",
    disabled: false,
    options: [
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
            name: "set-channel",
            description: "Set a channel where your to-do list will be saved and updated.",
            type: "SUB_COMMAND",
            options: [{ name: "channel", description: "Set a channel.", type: "CHANNEL", channelTypes: ["GUILD_TEXT"], required: true}]
        },
        {
            name: "refresh",
            description: "Refresh your channel saved to-do-list, if you believe it is incorrect.",
            type: "SUB_COMMAND",

        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        async function updateList() {

            var data = await DB.findOne({ MemberID: interaction.member.id})
                      
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
                var message = await channel.messages.fetch(data.MessageID)
                if(message) 
                    message.edit({embeds: [updatedList]})
            }
        }

        const item = interaction.options.getString("item")
        const itemNumber = interaction.options.getInteger("item-number")
        const option = interaction.options.getBoolean("option")

        var data = await DB.findOne({ MemberID: interaction.member.id})

        if(!data)
            data = await DB.create({ MemberID: interaction.member.id, List: []})

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

        const toDoList = new MessageEmbed()
            .setColor(system_embed_colour)
            .setTitle(`${interaction.member.nickname ? interaction.member.nickname : interaction.member.displayName}'s to-do list`)
            .setDescription(list)

        if(list.length > 4096)
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("Your to-do list is too long, please clear it using /to-do-list clear.")], ephemeral})

        switch(interaction.options.getSubcommand()) {
            case "privacy":
                if(option) {
                    await DB.findOneAndUpdate({MemberID: interaction.member.id}, {PrivacyMode: true})
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Privacy mode has been enabled.`)], ephemeral: true})
                } else {
                    await DB.findOneAndUpdate({MemberID: interaction.member.id}, {PrivacyMode: false})
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Privacy mode has been disabled.`)], ephemeral: data.ChannelID == interaction.channel.id ? true: false})
                }

            break;

            case "add-messages-to-list":
                if(option) {
                    await DB.findOneAndUpdate({MemberID: interaction.member.id}, {MessageCreateToAdd: true})
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Messages sent in to dedicated to-do list channels will automatically be added to the list.`)], ephemeral: true})
                } else {
                    await DB.findOneAndUpdate({MemberID: interaction.member.id}, {MessageCreateToAdd: false})
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Messages sent in to dedicated to-do list channels will no longer automatically be added to the list.`)], ephemeral: data.ChannelID == interaction.channel.id ? true: false})
                }

            break;

            case "show":
                return interaction.reply({embeds: [toDoList], ephemeral})
            break;

            case "add":
                List.push({"name": item, "tickedOff": false})
                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})
        
                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} \`${item}\` has been added to your to-do list.`)], ephemeral})
            break;

            case "remove":
                if(itemNumber < 0 || itemNumber > data.List.length)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`This item is not in your list.`)], ephemeral})

                const itemRemoved = List[itemNumber-1]

                List.splice(itemNumber-1, 1)

                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} \`${itemRemoved.name}\` has been removed from your list.`)], ephemeral})
            break;

            case "tick":
                if(itemNumber < 0 || itemNumber > data.List.length)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This item is not in your list.`)], ephemeral})
                
                if(List[itemNumber-1].tickedOff == true)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} \`${List[itemNumber-1].name}\` has already been ticked off.`)], ephemeral})

                List[itemNumber-1].tickedOff = true
                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} \`${List[itemNumber-1].name}\` has been ticked off.`)], ephemeral})
            break;

            case "untick":
                if(itemNumber < 0 || itemNumber > data.List.length)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This item is not in your list.`)], ephemeral})

                if(List[itemNumber-1].tickedOff == false)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} \`${List[itemNumber-1].name}\` has not been ticked off.`)], ephemeral})

                List[itemNumber-1].tickedOff = false
                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} \`${List[itemNumber-1].name}\` has been unticked.`)], ephemeral})
            break;

            case "tick-all":
                for (let i = 0; i < List.length; i++) {
                    List[i].tickedOff = true
                }
                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})
                
                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} All items in your to-do list have been ticked off.`)], ephemeral})
            break;

            case "untick-all":
                for (let i = 0; i < List.length; i++) {
                    List[i].tickedOff = false
                }
                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})
                
                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} All items in your to-do list have been unticked.`)], ephemeral})
            break;

            case "clear":
                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: []})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Your list has been cleared.`)], ephemeral})
            break;

            
            case "clear-ticked":
                for (let i = 0; i < List.length; i++) {
                    if(List[i].tickedOff == true) {
                        await List.splice(i, 1)
                    }
                }

                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Ticked off items in your list have been cleared.`)], ephemeral})
            break;

            
            case "clear-unticked":
                for (let i = 0; i < List.length; i++) {
                    if(List[i].tickedOff != true)
                        await List.splice(i, 1)
                }

                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Unticked items in your list have been cleared.`)], ephemeral})
            break;

            
            case "set-channel":
                var channel = interaction.options.getChannel("channel")

                try {
                    const message = await channel.send({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription("Setting up to-do list...")]})
                    await DB.findOneAndUpdate({ChannelID: channel.id, MessageID: message.id})
                    interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Your to-do list has successfully been set up in ${channel} `)], ephemeral})
                } catch (error) {
                    if(error.message === "Missing Access") {
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The bot does not have access to this channel.`)], ephemeral})
                    } else {
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} An error occured. \n\n \`\`\`${error}\`\`\``)], ephemeral})
                    }    
                }

                await updateList()
            break;

            case "refresh":  
                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Your to-do list has been refreshed.`)], ephemeral})
            break;
        }
    }
}