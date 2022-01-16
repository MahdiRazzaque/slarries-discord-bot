const reactionRole = require("../../structures/schemas/reactionRoleDB");
const { reactionRole_enabled } = require("../../structures/config.json")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        if (!interaction.isButton()  || !interaction.guild) return;
        if(!reactionRole_enabled) return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("Reaction roles are currently disabled.")], ephemeral: true})

        const { customId } = interaction

        const emoji = interaction?.component?.emoji;

        const menu = await reactionRole.findOne({ message: interaction.message.id });

        if (!menu || menu.roles.length === 0 || !menu.roles.some(v => v.emoji === emoji.id || v.emoji === emoji.name)) return;

        const member = interaction.guild.members.cache.get(interaction.user.id);

        menu.roles.forEach(v => {
            const role = interaction.guild.roles.cache.get(v.role);

            if ((v.emoji !== emoji.name && v.emoji !== emoji.id)) return;

            if (!member.roles.cache.has(role.id)) {
                member.roles.add(role).then(() => {
                    if(member.roles.cache.has("931883459834699817") && member.roles.cache.has("916385872562229325")) {
                        member.roles.remove(interaction.guild.roles.cache.get("931883459834699817"))
                    }
                    interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`You have been given the **${role.name}** role.`)], ephemeral: true })

                }).catch(() => {
                    interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`Failed to give you the **${role.name}** role.`)], ephemeral: true })
                })
            } else {
                member.roles.remove(role).then(() => {
                    interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`The **${role.name}** role has been removed from you.`)], ephemeral: true })
                }).catch(() => {
                    interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`Failed to remove the **${role.name}** role from you.`)], ephemeral: true })
                })
            }
        })
    }
}