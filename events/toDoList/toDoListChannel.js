const { Client, Message, Collection, MessageEmbed } = require("discord.js");
const DB = require("../../structures/schemas/toDoListDB");
const { system_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "messageCreate",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  async execute(message, client) {
    async function updateList(message) {

        var data = await DB.findOne({ MemberID: message.author.id})
                  
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
            .setTitle(`${message.member.nickname ? message.member.nickname : message.member.displayName}'s to-do list`)
            .setDescription(list)

        var channel = await client.channels.cache.get(data.ChannelID)
        
        if(channel) {
            var message = await channel.messages.fetch(data.MessageID)
            if(message) 
                message.edit({embeds: [updatedList]})
        }
    }

    const data = await DB.findOne({ ChannelID: message.channel.id})

    if(!data) return;
    
    var List = data.List

    var list = ``

    if(List.length <= 0) {
        list = "Empty"
    } else {
        for (let i = 0; i < List.length; i++) {
            list += `\`\`\`${i+1}. ${List[i].name} ${List[i].tickedOff ? "✅" : "☐"}\`\`\`\n`
          }
    }

    if(data.ChannelID != message.channel.id) return;

    if(message.author.id == client.user.id) return;
    if(message.author.bot) return message.delete();

    if(data.MessageCreateToAdd && data.MemberID == message.author.id) {
        List.push({"name": message.content, "tickedOff": false})
        await DB.findOneAndUpdate({MemberID: message.author.id}, {List: List})

        await updateList(message)

        return message.delete()
    } else if(data.MemberID != message.author.id) {
        const notYourChannelreply = await message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This isn't your to-do list channel.`)]})
        setTimeout(async () => {
            await notYourChannelreply.delete()
            await message.delete()
        }, 3000)
    } else {
        const reply = await message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You cannot speak in this channel \nIf you would like to add an item to the list by sending a message in this channel, please use the command \`/to-do-list add-messages-to-list\` to enable this function.`)]})
        setTimeout(async () => {
            await reply.delete()
            await message.delete()
        }, 5000)     
    }
  },
};
