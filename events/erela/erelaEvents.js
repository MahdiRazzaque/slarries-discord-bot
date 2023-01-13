const client = require("../../structures/bot.js");
const { MessageEmbed } = require("discord.js")

client.manager
    .on("nodeConnect", (node) => {
        console.log(`[Erela] >> Connection has been established to "${node.options.identifier}".`)
    })

    .on("nodeDisconnect", (node, error) => {
        console.log(`[Erela] >> Lost connection to "${node.options.identifier}" due to an error: ${error.message}.`)
    })

    .on("nodeError", (node, error) => {
        console.log(`[Erela] >> Node "${node.options.identifier}" has encountered an error: ${error.message}.`)
    })
    .on("queueEnd", async (player) => {
        return setTimeout(async() => {
            if(player.queue.size == 0 && !player.playing && !player.queueRepeat) {
                await player.destroy()
                return await client.channels.cache.get(player.textChannel).send({embeds: [client.successEmbed(`Your queue finished so I left the voice channel.`, "🏃‍♂️", "BLURPLE")]})
            }
        }, 10 * 1000)
    })