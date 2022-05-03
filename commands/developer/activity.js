const { Client, MessageEmbed, CommandInteraction } = require('discord.js');
const { developer_embed_colour } = require("../../structures/config.json")

module.exports = {
    name: 'activity',
    description: 'Sets the activity for the bot.',
    usage: "/activity",
    userPermissions: ["ADMINISTRATOR"],
    disabled: false,
    botOwnerOnly: true,
    options: [
        {
            name: 'type',
            description: 'Choose between adding or removing the activity from the bot.',
            type: 'STRING',
            required: true,
            choices: [
                {name: 'add', value: 'add'},
                {name: 'remove', value: 'remove'},
            ],
        },
        {
            name: 'activity',
            description: 'Choose the activity.',
            type: 'STRING',
            required: false,
            choices: [
                { name: 'WATCHING', value: 'WATCHING'},
                { name: 'PLAYING', value: 'PLAYING' },
                { name: 'LISTENING', value: 'LISTENING' },
            ],
        },
        {
            name: 'text',
            description: 'Enter activity text.',
            type: 'STRING',
            required: false,
        },
    ],
    /**
     * @param {CommandInteraction} interaction 
     * @param {client} Client
     */
    async execute(interaction, client) {
        if (interaction.member.id === "381791690454859778") {
            const type     = interaction.options.getString('type');
            const activity = interaction.options.getString('activity');
            const text     = interaction.options.getString('text');

            switch (type) {
                case 'add':
                        if(!text) return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} Please set an activity text to be set.`)], ephemeral: true})
                        if(!activity) return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} Please set an activity type to be set.`)], ephemeral: true})
                        client.user.setActivity({ type: `${activity}`, name: `${text}` });
                        client.customStatus = true
                        interaction.reply({embeds: [new MessageEmbed().setColor(developer_embed_colour).setDescription(`${client.emojisObj.animated_tick} The activity has been set to **${activity}** ${text}.`)], ephemeral: true });
                    break;
                case 'remove': {
                        client.user.setPresence({ activity: null });
                        interaction.reply({embeds: [new MessageEmbed().setColor(developer_embed_colour).setDescription(`${client.emojisObj.animated_tick} The activity has been removed. `)], ephemeral: true });
                    break;
                }
            }
        }
    },
};