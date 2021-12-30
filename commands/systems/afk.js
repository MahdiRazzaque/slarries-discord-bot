const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../structures/schemas/AFKSystem");
const { afk_disabled } = require("../../structures/config.json");

module.exports = {
    name: "afk",
    description: "Set your status as AFK.",
    usage: "/afk",
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
        if(afk_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setDescription("<a:animated_cross:925091847905366096> **Command Disabled**")], ephemeral: true})};
        const { guild, options, user, createdTimestamp} = interaction;

        const Embed = new MessageEmbed()
        .setAuthor(user.tag, user.displayAvatarURL({dynamic: true}));

        const afkStatus = options.getString("status");

        try{
            switch(options.getSubcommand()) {
                case "set": {
                    await DB.findOneAndUpdate(
                        {GuildID: guild.id, UserID: user.id},
                        {Status: afkStatus, Time: parseInt(createdTimestamp/1000)},
                        {new: true, upsert: true}
                    )

                    Embed.setColor("GREEN").setDescription(`<a:animated_tick:925091839030231071> Your AFK status has been updated to: ${afkStatus}`)

                    return interaction.reply({embeds: [Embed], ephemeral: true})
                }
                case "return": {
                    await DB.deleteOne(
                        {GuildID: guild.id, UserID: user.id},
                    )

                    Embed.setColor("GREEN").setDescription(`<a:animated_tick:925091839030231071> Your AFK status has been removed.`)

                    return interaction.reply({embeds: [Embed], ephemeral: true})

                }
            }
        } catch (err) {
            console.log(err)
        }
    }
}