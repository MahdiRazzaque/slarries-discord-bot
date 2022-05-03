const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const menus = require('../../structures/schemas/reactionRoleDB');
const { admin_embed_colour } = require("../../structures/config.json")

module.exports = {
    name: "rr-menu",
    description: "Manage guild reaction role",
    options: [{
        name: "create",
        type: 1,
        description: "Create a new role menu",
        options: [{
            name: "name",
            description: "Name of the role menu",
            type: 3,
            required: true,
        }]
    }, {
        name: "delete",
        type: 1,
        description: "Delete a new role menu",
        options: [{
            name: "name",
            description: "Name of the role menu",
            type: 3,
            required: true,
        }]
    }, {
        name: "start",
        type: 1,
        description: "Start a new role menu",
        options: [{
            name: "name",
            description: "Name of the role menu",
            type: 3,
            required: true,
        }, {
            name: "channel",
            description: "Mention the channel",
            type: 7,
            required: true,
        }]
    }, {
        type: 1,
        name: "add-role",
        description: "Add a role in a reaction role menu",
        options: [{
            name: "name",
            description: "Name of the role menu",
            type: 3,
            required: true,
        }, {
            name: "role",
            description: "Mention the role",
            type: 8,
            required: true,
        }]
    }, {
        type: 1,
        name: "remove-role",
        description: "Remove a role from a reaction role menu",
        options: [{
            name: "name",
            description: "Name of the role menu",
            type: 3,
            required: true,
        }, {
            name: "role",
            description: "Mention the role",
            type: 8,
            required: true,
        }]
    }],
    usage: "/rr-menu",
    userPermissions: ["ADMINISTRATOR"],
    disabled: false,
    ownerOnly: true,

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async execute (interaction, client) {   
        await interaction.reply({ content: `${client.user.username} is thinking...` });

        const option = interaction.options.getSubcommand(true).toLowerCase();
        const name = interaction.options.getString("name")?.toLowerCase()?.trim();
        const menu = await menus.findOne({ name, guild: interaction.guildId });
        const my_role = interaction.guild.me.roles.highest.position;
        const role = interaction.options.getRole("role");
        const channel = interaction.options.getChannel("channel");

        if (option === "create") {
            if (menu) return interaction.editReply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} A reaction role menu with the name \`${name}\` already exists.`)]});

            await menus.create({ guild: interaction.guildId, name, message: "0" });

            interaction.editReply({ embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} A role menu has been created with the name \`${name}\`.`)]});
        } else if (option === "delete") {
            if (!menu) return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} A reaction role menu with the name \`${name}\` does not exist.`)]});

            await menus.findOneAndDelete({ guild: interaction.guildId, name });

            interaction.editReply({ embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} The role menu \`${name}\` has been deleted.`)]});
        } else if (option === "start") {
            if (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS") return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} Invalid channel was provided.`)]});
            if (menu.roles.length === 0) return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The role menu \`${name}\` has 0 roles`)]});

            const reactionRoleEmbed = new MessageEmbed()
                .setColor("AQUA")
                .setTitle(`__**${menuCapitalized = menu.name.charAt(0).toUpperCase() + menu.name.slice(1)}**__`)

            let content = `ㅤ\n`,
            
                rows = [new MessageActionRow()], index;

            menu.roles.forEach((v, i) => {
                content += `> ${interaction.guild.emojis.cache.get(v.emoji)?.toString() || v.emoji} : \`${interaction.guild.roles.cache.get(v.role).name}\`\n\n`

                index = parseInt(i / 5);
                const button = new MessageButton({
                    customId: `reaction_role_${i}`,
                    style: "PRIMARY",
                    emoji: v.emoji,
                });

                rows[index] ? rows[index].addComponents(button) : rows[index] = new MessageActionRow().addComponents(button)
            })
            
            reactionRoleEmbed.setDescription(content);


            const msg = await channel.send({ embeds: [reactionRoleEmbed], components: rows });

            await menus.findOneAndUpdate({ name, guild: interaction.guildId }, { message: msg.id });

            interaction.editReply({ embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} The role menu \`${name}\` has been started successfully.`)]});
        } else if (option === "add-role") {
            if (!menu) return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} A reaction role menu with the name \`${name}\` does not exist.`)]});

            if (role.position >= my_role) return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The ${role} role is above my highest role, so please put my role above it than try again.`)]});

            const msg = await interaction.channel.send({ embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`React with the emoji you want for this role`)]});

            const reactions = await msg.awaitReactions({
                errors: ["time"],
                filter: (r, u) => u.id === interaction.user.id,
                max: 1,
                time: 300000
            }).catch(e => { })

            const emoji = reactions.first()?.emoji;

            if (!emoji) return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You too too long to respond.`)]});

            if (menu.roles.some(v => v.role === role.id)) return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The reaction role menu \`${name}\` already has the provided role.`)]});
            if (menu.roles.some(v => v.emoji === emoji.id || v.emoji === emoji.name)) return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The reaction role menu \`${name}\` already has the provided emoji.`)]});

            menu.roles.push({ role: role.id, emoji: emoji.id || emoji.name });

            await menus.findOneAndUpdate({ name, guild: interaction.guildId }, { roles: menu.roles });

            interaction.editReply({ embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} Added role \`${role.name}\` with emoji : ${emoji.toString()} for menu \`${menu.name}\`.`)]});
            await msg.delete();
        } else if(option=== "remove-role") {
            if (!menu) return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} A reaction role menu with the name \`${name}\` does not exist.`)]});

            if (!menu.roles.some(v => v.role === role.id)) return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The reaction role \`${menu.name}\` menu does not have this role.`)]});

            menu.roles = menu.roles.filter((v) => v.role !== role.id);

            await menus.findOneAndUpdate({ name, guild: interaction.guildId }, { roles: menu.roles });

            interaction.editReply({ embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} Removed role \`${role.name}\` with emoji : ${emoji.toString()} for menu \`${menu.name}\`.`)]});
        }
    }
}