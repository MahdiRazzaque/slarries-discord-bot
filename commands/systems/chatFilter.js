const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const DB = require("../../structures/schemas/filterDB");
const { system_embed_colour } = require("../../structures/config.json")

module.exports = {
    name: "filter",
    description: "A simple chat filtering system.",
    usage: "/filter",
    disabled: false,
    ownerOnly: true,
    userPermissions: ["MANAGE_MESSAGES"],
    options: [
        {
            name: "clear",
            description: "Clear your blacklist",
            type: "SUB_COMMAND"
        },
        {
            name: "settings",
            description: "Setup your filtering system.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "logging",
                    description: "Select the logging channel.",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true,
                },
            ],
        },
        {
            name: "configure",
            description: "Add or remove words from the blacklist.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "options",
                    description: "Select a option.",
                    type: "STRING",
                    required: true,
                    choices: [
                        { name: "Add", value: "add" },
                        { name: "Remove", value: "remove" },
                    ],
                },
                {
                    name: "word",
                    description: "Provide a word/phrase you want to blacklist. Add multiple words using a comma e.g. word1,word2.",
                    type: "STRING",
                    required: true,
                },
            ],
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;
        
        const subCommand = options.getSubcommand();

        switch(subCommand) {
            case "clear":
                await DB.findByIdAndUpdate({ Guild: guild.id }, { Words: []});
                client.filters.get(guild.id, [])
                interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} The blacklisted word list was successfully cleared.`)]})
                break;
                
            case "settings":
                const loggingChannel = options.getChannel("logging").id;

                await DB.findOneAndUpdate(
                    { Guild: guild.id },
                    { Log: loggingChannel },
                    { new: true, upsert: true }
                );

                client.filtersLog.set(guild.id, loggingChannel);

                interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Added <#${loggingChannel}> as the logging channel for the filtering system.`)], ephemeral: true});
                break;
            
            case "configure":
                const Choice = options.getString("options");
                const Words = options.getString("word").toLowerCase().split(",");

                switch(Choice) {
                    case "add":
                        DB.findOne({ Guild: guild.id }, async (err, data) => {
                            if(err) throw err;
                            if(!data) {
                                await DB.create({
                                    Guild: guild.id,
                                    Log: null,
                                    Words: Words,
                                });

                                client.filters.set(guild.id, Words);

                                return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Added ${Words.length} new word(s) to the blacklist.`)], ephemeral: true});
                            }

                            const newWords = [];

                            Words.forEach((w) => {
                                if(data.Words.includes(w)) return;
                                newWords.push(w);
                                data.Words.push(w);
                                client.filters.get(guild.id).push(w);
                            });

                            interaction.reply({ embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Added ${newWords.length} new word(s) to the blacklist.`)]})
                        })
                        break;
                    case "remove":
                        DB.findOne({ Guild: guild.id }, async (err, data) => {
                            if(err) throw err;
                            if(!data) {
                                return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("There is no data to remove.")]});
                            }
                            
                            const removedWords = [];

                            Words.forEach((w) => {
                                if(!data.Words.includes(w)) return;
                                data.Words.remove(w);
                                removedWords.push(w);
                            });

                            const newArray = client.filters.get(guild.id).filter((word) => !removedWords.includes(word))

                            client.filters.set(guild.id, newArray);

                            interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Removed ${removedWords.length} from the blacklist.`)]});
                        })

                        break;
                }
                break;
            
        }
    }
}