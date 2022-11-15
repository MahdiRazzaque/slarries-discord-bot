const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const { system_embed_colour } = require("../../structures/config.json");

module.exports = {
    name: "music",
    description: "Complete music system",
    usage: "/music",
    disabled: false,
    botCommandChannelOnly: true,
    options: [
        {
            name: "play",
            description: "play a song.",
            type: "SUB_COMMAND",
            options: [{ name: "query", description: "Provide a name or a url of the song", type: "STRING", required: true}]
        },
        {
            name: "volume",
            description: "change the volume",
            type: "SUB_COMMAND",
            options: [{ name: "percent", description: "10 = 10%", type: "NUMBER", required: true}]
        },
        {
            name: "seek",
            description: "Seeks to the specified time in the song.",
            value: "seek",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "time",
                    description: "Provide a position (in seconds) to seek.",
                    type: "NUMBER",
                    required: true
                },
            ]

        },
        {
            name: "filters",
            description: "Toggle filters",
            type: "SUB_COMMAND",
            options: [{ name: "set", description: "Choose a filter", type: "STRING", required: true,
            choices: [
                {name: "🔌 Turn off all filters", value: "false"},
                {name: "📣 Toggle 3d filter", value: "3d"},
                {name: "📣 Toggle bassboost filter", value: "bassboost"},
                {name: "📣 Toggle echo filter", value: "echo"},
                {name: "📣 Toggle nightcore filter", value: "nightcore"},
                {name: "📣 Toggle surround filter", value: "surround"},
                {name: "📣 Toggle karaoke filter", value: "karaoke"},
                {name: "📣 Toggle vaporwave filter", value: "vaporwave"},
                {name: "📣 Toggle flanger filter", value: "flanger"},
                {name: "📣 Toggle gate filter", value: "gate"},
                {name: "📣 Toggle haas filter", value: "haas"},
                {name: "📣 Toggle reverse filter", value: "reverse"},
                {name: "📣 Toggle mcompand filter", value: "mcompand"},
                {name: "📣 Toggle phaser filter", value: "phaser"},
                {name: "📣 Toggle tremolo filter", value: "tremolo"},
                {name: "📣 Toggle earwax filter", value: "earwax"},
        
            ]}]
        },
        {
            name: "settings",
            description: "Select an option",
            type: "SUB_COMMAND",
            options: [{ name: "options", description: "Select an option", type: "STRING", required: true,
            choices: [
                {name: "🔢 Show Queue", value: "queue"},
                {name: "⏭ Skip Song", value: "skip"},
                {name: "⏸ Pause Song", value: "pause"},
                {name: "⏯ Resume Song", value: "resume"},
                {name: "⏹ Stop Music", value: "stop"},
                {name: "🔀 Shuffle Queue", value: "shuffle"},
                {name: "🔃 Toggle AutoPlay Modes", value: "AutoPlay"},
                {name: "🔼 Add a Related Song", value: "RelatedSong"},
                {name: "🔁 Toggle Repeat Mode", value: "RepeatMode"},
                {name: "⏮ Play Previous Song", value: "previous"},
            ]}]
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;
        const VoiceChannel = member.voice.channel;

        if(!VoiceChannel)
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You must be in a voice channel to be able to use music commands.`)], ephemeral: true});

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} I'm already playing music in <#${guild.me.voice.channelId}>.`)], ephemeral: true});

        try {
            switch(options.getSubcommand()) {
                case "play" : {
                    client.distube.play( VoiceChannel, options.getString("query"), { textChannel: channel, member: member });
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setTitle("🎼 Request recieved.")]});
                }
                case "volume" : {
                    const Volume = options.getNumber("percent");
                    if(!Volume > 100 || Volume < 1)
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setTitle(`You have to specify a number between 1 and 100. ${client.emojisObj.animated_cross}`)], ephemeral: true});

                    client.distube.setVolume(VoiceChannel, Volume);
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setTitle(`📶 Volume has been set to \`${Volume}%\``)]});
                }
                case "seek" : {
                    const queue = await client.distube.getQueue(VoiceChannel);
                    const Time = options.getNumber("time");

                    if(!queue)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle(`There is no queue. ${client.emojisObj.animated_cross}`)]});

                    await queue.seek(Time);
                    return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setTitle(`⌛ **Seeked to \`${Time}\`**`)]});
                }

                case "settings" : {
                    const queue = await client.distube.getQueue(VoiceChannel);

                    if(!queue)
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle(`There is no queue. ${client.emojisObj.animated_cross}`)]});

                    switch(options.getString("options")) {
                        case "skip" : 
                        await queue.skip(VoiceChannel);
                        return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription("⏭ Song has been skipped.")]});

                        case "stop" : 
                        await queue.stop(VoiceChannel);
                        return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription("⏹ Music has been stopped.")]});

                        case "pause" : 
                        await queue.pause(VoiceChannel);
                        return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription("⏸ Song has been paused.")]});

                        case "resume" : 
                        await queue.resume(VoiceChannel);
                        return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription("▶️ Song has been resumed.")]});

                        case "previous" :
                        await queue.previous(VoiceChannel);
                        return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription("⏮ Playing previous track.")]});

                        case "shuffle" : 
                        await queue.shuffle(VoiceChannel);
                        return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription("🔀 Queue has been shuffled.")]});

                        case "AutoPlay" : 
                        let Mode = await queue.toggleAutoplay(VoiceChannel);
                        return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`🔃 AutoPlay mode has been set to: ${Mode ? "On" : "Off"}`)]});

                        case "RelatedSong" : 
                        await queue.addRelatedSong(VoiceChannel);
                        return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription("🈁 A related song has been added to the queue")]});

                        case "RepeatMode" : 
                        let Mode2 = await client.distube.setRepeatMode(queue);
                        return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`🔁 Repeat mode has been set to: ${Mode2 = Mode2 ? Mode2 == 2 ? "Queue": "Song" : "Off"}`)]});

                        case "queue" : 
                        return interaction.reply({embeds: [new MessageEmbed().setColor(system_embed_colour).setTitle("__Queue__").setDescription(`${queue.songs.slice(0, 10).map((song, id) => `\n**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``)}`)]});      
                    }
                    return;
                }
                case "filters" : {
                    const queue = await client.distube.getQueue(VoiceChannel);

                    if(!queue)
                      return interaction.reply({content: "⛔ There is no queue"});

                    if(options.getString("set") == "false") {
                      await queue.setFilter(false);
                      return interaction.reply({ embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Turned off all filters.`).addField("Enabled filters", queue.filters.join(", ") || "None")]});
                    } else {
                      await queue.setFilter(options.getString("set"));
                      return interaction.reply({ embeds: [new MessageEmbed().setColor(system_embed_colour).setDescription(`${client.emojisObj.animated_tick} Toggled the ${options.getString("set")} filter.`).addField("Enabled filters", queue.filters.join(", ") || "None")]});
                    }
                }
            }
        } catch (e) {
            const errorEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`${client.emojisObj.animated_cross} Error`)
            .setDescription(`${e}`)
            return interaction.reply({embeds: [errorEmbed]});
        }
    }
}