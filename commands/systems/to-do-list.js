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
            name: "set-channel",
            description: "Set a channel where your to-do list will be saved and updated.",
            type: "SUB_COMMAND",
            options: [{ name: "channel", description: "Set a channel.", type: "CHANNEL", channelTypes: ["GUILD_TEXT"], required: true}]
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

        var data = await DB.findOne({ MemberID: interaction.member.id})

        if(!data)
            data = await DB.create({ MemberID: interaction.member.id, List: []})

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
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("Your to-do list is too long, please clear it using /to-do-list clear.")]})

        switch(interaction.options.getSubcommand()) {
            case "show":
                return interaction.reply({embeds: [toDoList]})
            break;

            case "add":
                List.push({"name": item, "tickedOff": false})
                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})
        
                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} \`${item}\` has been added to your to-do list.`)]})
            break;

            case "remove":
                if(itemNumber < 0 || itemNumber > data.List.length)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`This item is not in your list.`)]})

                const itemRemoved = List[itemNumber-1]

                List.splice(itemNumber-1, 1)

                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} \`${itemRemoved.name}\` has been removed from your list.`)]})
            break;

            case "tick":
                if(itemNumber < 0 || itemNumber > data.List.length)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This item is not in your list.`)]})
                
                if(List[itemNumber-1].tickedOff == true)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} \`${List[itemNumber-1].name} has already been ticked off.`)]})

                List[itemNumber-1].tickedOff = true
                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} \`${List[itemNumber-1].name}\` has been ticked off.`)]})
            break;

            case "untick":
                if(itemNumber < 0 || itemNumber > data.List.length)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This item is not in your list.`)]})

                if(List[itemNumber-1].tickedOff == false)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} \`${List[itemNumber-1].name}\` has not been ticked off.`)]})

                List[itemNumber-1].tickedOff = false
                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} \`${List[itemNumber-1].name}\` has been unticked.`)]})
            break;

            case "tick-all":
                for (let i = 0; i < List.length; i++) {
                    List[i].tickedOff = true
                }
                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})
                
                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} All items in your to-do list have been ticked off.`)]})
            break;

            case "untick-all":
                for (let i = 0; i < List.length; i++) {
                    List[i].tickedOff = false
                }
                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: List})
                
                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} All items in your to-do list have been unticked.`)]})
            break;

            case "set-channel":
                var channel = interaction.options.getChannel("channel")

                try {
                    const message = await channel.send({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription("Setting up to-do list...")]})
                    await DB.findOneAndUpdate({ChannelID: channel.id, MessageID: message.id})
                    interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Your to-do list has successfully been set up in ${channel} `)]})
                } catch (error) {
                    if(error.message === "Missing Access") {
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The bot does not have access to this channel.`)]})
                    } else {
                        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} An error occured. \n\n \`\`\`${error}\`\`\``)]})
                    }    
                }

                await updateList()
            break;

            case "clear":
                await DB.findOneAndUpdate({MemberID: interaction.member.id}, {List: []})

                await updateList()

                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Your list has been cleared.`)]})
            break;
        }
    }
}