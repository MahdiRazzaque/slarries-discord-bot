const DB = require("../structures/schemas/hypixelStatsInteractionDB");

module.exports = (client) => {
    DB.find().then((documents) => {
        documents.forEach(async (doc) => {
            if((Date.now() - doc.DateOpened) > 60000) {
                var channel = await client.channels.cache.get(doc.ChannelID)
            
                if(channel) {
                    var message = await channel.messages.fetch(doc.MessageID).catch((e) => {})
                    if(message) 
                        await message.edit({components: []}).catch((e) => {console.log(e)})
                }
                return await doc.delete()
            } else {
                setTimeout(async () => {
                    var channel = await client.channels.cache.get(doc.ChannelID)
            
                    if(channel) {
                        var message = await channel.messages.fetch(doc.MessageID).catch((e) => {})
                        if(message) 
                            await message.edit({components: []}).catch((e) => {console.log(e)})
                    }
                    return await doc.delete()
                }, Date.now() - doc.DateOpened) 
            }
        })
    })
}