const { MessageEmbed, MessageCollector, CommandInteraction, Client } = require('discord.js');
const { admin_embed_colour } = require("../../structures/config.json")

function delay(time) {return new Promise((resolve) => setTimeout(resolve, time))}

module.exports = {
    name: 'nuke',
    description: "Nukes a channel",
    usage: "/nuke",
    permisson: "ADMINISTRATOR",
    disabled: false,
    options: [
      {
        name: "channel",
        description: "Select a channel to nuke.",
        type: "CHANNEL",
        channelTypes: ["GUILD_TEXT"],
      },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {MessageCollector} collector
     */
    async execute (interaction, client) {
        const clearchannel = interaction.options.getChannel("channel") || interaction.channel;

        const filter = m => m.author.id === interaction.member.id

        const M = await interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`Are sure you want to nuke ${clearchannel}? Type: \`yes\` or \`no\`. You have 10 seconds to respond.`)], fetchReply: true})

        const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

        var nuked;

        collector.on("collect", (collected) => {
            if (collected.content === "no") {
                nuke = "cancelled"
                return M.edit({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`The nuke has been cancelled.`)]})
            }
            if (collected.content === "yes") {
                
                const embed = new MessageEmbed()
                    .setColor(admin_embed_colour)
                    .setDescription(`${client.emojisObj.animated_tick} This channel just got nuked!!`)
                    .setImage('https://media.discordapp.net/attachments/772390491303575582/819086461739335720/tenor_5.gif?width=560&height=472')
                    .setTimestamp()

                clearchannel.clone().then(async(channel) => {
                    await delay(1000)
                    const m = channel.send({content: `${interaction.member}`,embeds: [embed]}).then((m) => {
                        setTimeout(() => {
                            m.delete().catch(() => {})
                        }, 1 * 10000)
                    })
                })
                clearchannel.delete()
                nuked = "nuked"
            }
        })

        collector.on("end", () => {
            switch(nuked) {
                case "nuked":
                    M.edit({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} ${clearchannel.name} was successfully nuked.`)]})
                break;
                case "cancelled":
                    M.edit({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} The nuke was cancelled.`)]})
                break;
            }
        })
    }
}