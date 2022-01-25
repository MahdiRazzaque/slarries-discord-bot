const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../structures/schemas/AFKSystem");

module.exports = {
    name: "afk",
    description: "Set your status as AFK.",
    usage: "/afk",
    disabled: false,
    options: [
        {
            name: "set",
            type: "SUB_COMMAND",
            description: "Set your AFK status.",
            options: [
                {
                    name: "status",
                    description: "Set your status.",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "return",
            type: "SUB_COMMAND",
            description: "Return from being AFK."
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const { guild, options, user, createdTimestamp} = interaction;

        const Embed = new MessageEmbed()
        .setAuthor({name: `${user.tag}`, url: user.displayAvatarURL({dynamic: true})})

        const afkStatus = options.getString("status");

        try{
            switch(options.getSubcommand()) {
                case "set": {
                    await DB.findOneAndUpdate(
                        {GuildID: guild.id, UserID: user.id},
                        {Status: afkStatus, Time: parseInt(createdTimestamp/1000)},
                        {new: true, upsert: true}
                    )

                    Embed.setColor("GREEN").setDescription(`${client.emojisObj.animated_tick} Your AFK status has been updated to: ${afkStatus}`)

                    return interaction.reply({embeds: [Embed], ephemeral: true})
                }
                case "return": {
                    await DB.deleteOne(
                        {GuildID: guild.id, UserID: user.id},
                    )

                    Embed.setColor("GREEN").setDescription(`${client.emojisObj.animated_tick} Your AFK status has been removed.`)

                    return interaction.reply({embeds: [Embed], ephemeral: true})

                }
            }
        } catch (err) {
            console.log(err)
        }
    }
}