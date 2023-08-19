const { Client, MessageEmbed, CommandInteraction } = require('discord.js');
const { developer_embed_colour } = require("../../structures/config.json")

module.exports = {
    name: 'eval',
    description: 'Evaluate some code',
    usage: "/eval",
    userPermissions: ["ADMINISTRATOR"],
    disabled: false,
    botOwnerOnly: true,
    options: [
        {
            name: 'code',
            description: 'Enter code.',
            type: 'STRING',
            required: true,
        },
    ],
    /**
     * @param {CommandInteraction} interaction 
     * @param {client} Client
     */
    async execute(interaction, client) {
        const clean = async (text) => {
            if (text && text.constructor.name == "Promise")
              text = await text;

            if (typeof text !== "string")
              text = require("util").inspect(text, { depth: 1 });
            
            // Replace symbols with character code alternatives
            text = text
              .replace(/`/g, "`" + String.fromCharCode(8203))
              .replace(/@/g, "@" + String.fromCharCode(8203));
            
            return text;
        }

        try {
            const evaled = eval(interaction.options.getString("code"));

            var cleaned = await clean(evaled)

            return interaction.reply({embeds: [new MessageEmbed().setColor(developer_embed_colour).setDescription(`\`\`\`js\n${cleaned}\n\`\`\``)]})
        } catch (error) {
            return interaction.reply({embeds: [new MessageEmbed(),setColor(developer_embed_colour).setDescription(`\`ERROR\` \`\`\`xl\n${cleaned}\n\`\`\``)]})  
        }
    },
};