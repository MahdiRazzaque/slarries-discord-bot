const {CommandInteraction, MessageEmbed } = require("discord.js")
const { admin_embed_colour } = require("../../structures/config.json")

module.exports = {
    name: "send-embed",
    description: "Generate a custom embed!",
    usage: "/send-embed",
    permission: "ADMINISTRATOR",
    disabled: false,
    options: [
        { name: "colour", description: "Provide a colour for the embed.", type: "STRING"},
        { name: "title", description: "Provide a title for the embed.", type: "STRING"},
        { name: "url", description: "Provide a url for the embed.", type: "STRING"},
        { name: "author", description: "Provide an author for the embed.", type: "STRING"},
        { name: "description", description: "Provide a description for the embed.", type: "STRING"},
        { name: "thumbnail", description: "Provide a thumbnail for the embed.", type: "STRING"},
        { name: "image", description: "Provide an image for the embed.", type: "STRING"},
        { name: "timestamp", description: "Enable timestamp?", type: "BOOLEAN"},
        { name: "footer", description: "Provide a footer for the embed.", type: "STRING"},
        { name: "fields", description: "name^value^inline (true or false)^^", type: "STRING" },
        { name: "channel", description: "Select a channel to send the embed to.", type: "CHANNEL", channelTypes: ["GUILD_TEXT"]},
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const eFields     = [[], [], []];
        const splitFields = [];

        
        const colour      = options.getString("colour");
        const title       = options.getString("title");
        const url         = options.getString("url");
        const author      = options.getString("author");
        const description = options.getString("description");
        const thumbnail   = options.getString("thumbnail");
        const image       = options.getString("image");
        const timestamp   = options.getBoolean("timestamp");
        const footer      = options.getString("footer");
        const gChannel = options.getChannel("channel") || interaction.channel;
        let   fields      = options.getString("fields");

        const embed       = new MessageEmbed();

        if(url && url.includes("http"))             embed.setURL(url);
        if(thumbnail && thumbnail.includes("http")) embed.setThumbnail(thumbnail);
        if(image && image.includes("http"))         embed.setImage(image);
        if(colour)                                  embed.setColor(colour.toUpperCase());
        if(title)                                   embed.setTitle(title);
        if(author)                                  embed.setAuthor({name: `${author}`});
        if(description)                             embed.setDescription(description);
        if(timestamp)                               embed.setTimestamp();
        if(footer)                                  embed.setFooter({text: `${footer}`});
        if(fields) {
            fields = fields.split("^");
            fields.forEach(e => {
                if(e.length > 0) {
                    splitFields.push(e.trim())
                }
            });
    
            let x = 0;
            for (let i = 0; i < splitFields.length; i++) {
                if(x == 3) x = 0;
                eFields[x].push(splitFields[i]);
                x++;
            }
                
            for (let i = 0; i < eFields[0].length; i++) {
                embed.addField(`${eFields[0][i]}`, `${eFields[1][i]}`, JSON.parse(eFields[2][i].toLowerCase()));
            }
        }

        if(!embed.title && !embed.description && !embed.fields[0]) {
            embed.setDescription("<a:animated_cross:925091847905366096> You have not provided valid options! ")
            embed.setColor("RED")
        }
        const message = client.channels.cache.get(gChannel.id).send({embeds: [embed]});
        interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`<a:animated_tick:925091839030231071> The embed was successfully sent to ${gChannel} `)], ephemeral: true})
    }
}