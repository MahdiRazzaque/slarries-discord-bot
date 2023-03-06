const { CommandInteraction, MessageEmbed, Client, MessageButton } = require("discord.js");
const util = require("../../functions/erela.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client(process.env.genuisAPIKey);
const axios = require("axios")
const cheerio = require("cheerio")
const { botOwners } = require("../../structures/config.json")

async function extractLyrics(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const lyricsContainer = $('[data-lyrics-container="true"]');

    // Replace <br> with newline
    $("br", lyricsContainer).replaceWith("\n");

    // Replace the elements with their text contents
    $("a", lyricsContainer).replaceWith((_i, el) => $(el).text());

    // Remove all child elements, leaving only top-level text content
    lyricsContainer.children().remove();

    return lyricsContainer.text();
}

module.exports = {
    name: "music",
    description: "A complete music system",
    usage: "/music",
    options: [
        {
            name: "play",
            description: "Plays a song.",
            type: "SUB_COMMAND",
            options: [{ name: "query", description: "Provide the name of the song or URL.", type: "STRING", required: true }]
        },
        {
            name: "volume",
            description: "Alter the volume.",
            type: "SUB_COMMAND",
            options: [{ name: "percent", description: "10 = 10%", type: "NUMBER", required: true }]
        },
        {
            name: "settings",
            description: "Select an option.",
            type: "SUB_COMMAND",
            options: [{
                name: "options", description: "Select an option.", type: "STRING", required: true,
                choices: [
                    { name: "🔢 | View Queue", value: "queue" },
                    { name: "⏭ | Skip", value: "skip" },
                    { name: "⏸ | Pause", value: "pause" },
                    { name: "⏯ | Resume", value: "resume" },
                    { name: "⏹ | Stop", value: "stop" },
                    { name: "🔤 | Lyrics", value: "lyrics"},
                    { name: "🔀 | Shuffle", value: "shuffle" },
                    { name: "🔁 | Repeat track", value: "repeattrack" },
                    { name: "🎦 | Now Playing", value: "nowplaying" },                
                    { name: "🔚 | Clear Queue", value: "clearqueue" },
                    { name: "🔄 | Repeat Queue", value: "queuerepeat" },
                    { name: "📈 | Statistics", value: "statistics" },
                ]
            }],
        },
        {
            name: "filters",
            description: "Toggle filters",
            type: "SUB_COMMAND",
            options: [{ name: "set", description: "Choose a filter", type: "STRING", required: true,
            choices: [
                {name: "💡 Show enabled filter.", value: "enabled"},
                {name: "🔌 Turn off all filters.", value: "false"},
                {name: "📣 Toggle nightcore filter.", value: "nightcore"},
                {name: "📣 Toggle vaporwave filter.", value: "vaporwave"},
                {name: "📣 Toggle bassboost filter.", value: "bassboost"},
                {name: "📣 Toggle pop filter.", value: "pop"},
                {name: "📣 Toggle soft filter.", value: "soft"},
                {name: "📣 Toggle treblebass filter.", value: "treblebass"},
                {name: "📣 Toggle eightD filter.", value: "eightd"},
                {name: "📣 Toggle karaoke filter.", value: "karaoke"},
                {name: "📣 Toggle vibrato filter.", value: "vibrato"},
                {name: "📣 Toggle tremolo filter.", value: "tremolo"},       
            ]}]
        },
    ],
    /**
    * @param {CommandInteraction} interaction 
    * @param {Client} client 
    */
    async execute(interaction, client) {

        await interaction.deferReply()
        
        const { options, member, guild } = interaction;
        const VoiceChannel = member.voice.channel;

        if (!VoiceChannel)
            return interaction.editReply({ embeds: [client.errorEmbed("You aren't in a voice channel. Join one to be able to play music!")] });

        if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
            return interaction.editReply({ embeds: [client.errorEmbed(`I'm already playing music in <#${guild.me.voice.channelId}>.`)] });

        if(!guild.me.voice.channelId && options.getSubcommand() != "play") return interaction.editReply({ embeds: [client.errorEmbed("There is nothing playing.")]})

		var player = await client.manager.create({
			guild: interaction.guild.id,
			voiceChannel: member.voice.channel.id,
			textChannel: interaction.channelId,
			selfDeafen: true
		}) 

        let res;
        try {
            switch (options.getSubcommand()) {
                case "play": {
                    const query = interaction.options.getString("query");
                    res = await player.search(query, interaction.user.username);

                    if (res.loadType === "LOAD_FAILED") {
                        if (!player.queue.current) player.destroy();
                        return interaction.editReply({ embeds: [client.errorEmbed("An error has occured while trying to add this song.")] })
                    }

                    if (res.loadType === "NO_MATCHES") {
                        if (!player.queue.current) player.destroy();
                        return interaction.editReply({ embeds: [client.errorEmbed("No results found.")] })
                    }

                    if (res.loadType === "PLAYLIST_LOADED") {
                        player.connect();
                        player.queue.add(res.tracks);
                        if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();

                        return interaction.editReply({ embeds: [client.successEmbed(`**[${res.playlist.name}](${query})** has been added to the queue.`, "⏯", "BLURPLE")] })
                    }

                    if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
                        player.connect();
                        player.queue.add(res.tracks[0]);
                    }

                    const enqueueEmbed = client.successEmbed(`Enqueued **[${res.tracks[0].title}](${res.tracks[0].uri})** [${member}]`, "🔢", "BLURPLE")

                    await interaction.editReply({ embeds: [enqueueEmbed] });

                    if (!player.playing && !player.paused && !player.queue.size) player.play()

                    if (player.queue.totalSize > 1)
                        enqueueEmbed.addField("Position in queue", `${player.queue.size - 0}`);
                    return interaction.editReply({ embeds: [enqueueEmbed] })
                }

                case "volume": {
                    const volume = options.getNumber("percent");
                    if (!player.queue.current) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing playing.")] });
                    if (volume < 0 || volume > 100) return interaction.editReply({ embeds: [client.errorEmbed(`You can only set the volume from 0 to 100.`)] })
                    player.setVolume(volume);

                    return interaction.editReply({ embeds: [client.successEmbed(`Volume has been set to **${player.volume}%**.`, "📶", "BLURPLE")] })
                }

                case "filters": {
                    switch(options.getString("set")) {

                        case "enabled":
                            const enabledFiltersEmbed = new MessageEmbed().setColor("BLURPLE").setTitle("Enabled filter:")
                            var enabledFilter = "None"
                            const filters = [player.nightcore, player.vaporwave, player.bassboost, player.pop, player.soft, player.treblebass, player.eightD, player.karaoke, player.vibrato, player.tremolo]
                            filtersNames = ["Nightcore", "Vaporwave", "Bassboost", "Pop", "Soft", "Treblebass", "EightD", "Karaoke", "Vibrato", "Eremolo"]

                            for (let i = 0; i < filters.length; i++) {
                                if(filters[i]) {
                                    enabledFilter = filtersNames[i]
                                    break;
                                }      
                            }

                            enabledFiltersEmbed.setDescription(`${enabledFilter}`)

                            return interaction.editReply({embeds: [enabledFiltersEmbed]})
                        break;

                        case "false":
                            await player.reset();
                            return interaction.editReply({ embeds: [client.successEmbed(`All filters have been disabled.`, "🔌", "BLURPLE")] })
                        break;

                        case "nightcore":
                            player.nightcore ? player.nightcore = false : player.nightcore = true
                            return interaction.editReply({ embeds: [client.successEmbed(`Nightcore filter has been ${player.nightcore ? "enabled" : "disabled"}.`, "📣", "BLURPLE")] })
                        break;

                        case "vaporwave":
                            player.vaporwave ? player.vaporwave = false : player.vaporwave = true
                            return interaction.editReply({ embeds: [client.successEmbed(`Vaporwave filter has been ${player.vaporwave ? "enabled" : "disabled"}.`, "📣", "BLURPLE")] })
                        break;

                        case "bassboost":
                            player.bassboost ? player.bassboost = false : player.bassboost = true
                            return interaction.editReply({ embeds: [client.successEmbed(`Bassboost filter has been ${player.bassboost ? "enabled" : "disabled"}.`, "📣", "BLURPLE")] })
                        break;

                        case "pop":
                            player.pop ? player.pop = false : player.pop = true
                            return interaction.editReply({ embeds: [client.successEmbed(`Pop filter has been ${player.nightcore ? "enabled" : "disabled"}.`, "📣", "BLURPLE")] })
                        break;

                        case "soft":
                            player.soft ? player.soft = false : player.soft = true
                            return interaction.editReply({ embeds: [client.successEmbed(`Soft filter has been ${player.soft ? "enabled" : "disabled"}.`, "📣", "BLURPLE")] })
                        break;

                        case "treblebass":
                            player.treblebass ? player.treblebass = false : player.treblebass = true
                            return interaction.editReply({ embeds: [client.successEmbed(`Treblebass filter has been ${player.treblebass ? "enabled" : "disabled"}.`, "📣", "BLURPLE")] })
                        break;

                        case "eightd":
                            player.eightD ? player.eightD = false : player.eightD = true
                            return interaction.editReply({ embeds: [client.successEmbed(`EightD filter has been ${player.eightD ? "enabled" : "disabled"}.`, "📣", "BLURPLE")] })
                        break;

                        case "karaoke":
                            player.karaoke ? player.karaoke = false : player.karaoke = true
                            return interaction.editReply({ embeds: [client.successEmbed(`Karaoke filter has been ${player.karaoke ? "enabled" : "disabled"}.`, "📣", "BLURPLE")] })
                        break;
                        
                        case "vibrato":
                            player.vibrato ? player.vibrato = false : player.vibrato = true
                            return interaction.editReply({ embeds: [client.successEmbed(`Vibrato filter has been ${player.vibrato ? "enabled" : "disabled"}.`, "📣", "BLURPLE")] })
                        break;

                        case "tremolo":
                            player.tremolo ? player.tremolo = false : player.tremolo = true
                            return interaction.editReply({ embeds: [client.successEmbed(`Tremolo filter has been ${player.tremolo ? "enabled" : "disabled"}.`, "📣", "BLURPLE")] })
                        break;                       
                    }
                }

                case "settings": {
                    switch (options.getString("options")) {
                        case "skip": {
                            if (!player.queue.length && !player.queueRepeat) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing in the queue.")] });

                            await player.stop();

                            return interaction.editReply({ embeds: [client.successEmbed("Skipped.", "⏭", "BLURPLE")] });
                        }
                        case "nowplaying": {
                            if (!player.queue.current) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing playing.")] });
                            const track = player.queue.current;

                            const npEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setTitle("Now Playing")
                                .setDescription(`[${track.title}](${track.uri}) [${track.requester}]`)
                                .setThumbnail(track.thumbnail)

                            if(player.trackRepeat)
                                npEmbed.setFooter({ text: "Repeat is enabled."})
                                
                            return interaction.editReply({ embeds: [npEmbed] })
                        }
                        case "pause": {
                            if (!player.playing) return interaction.editReply({ embeds: [client.errorEmbed("The music is already paused or nothing is playing.")] });

                            await player.pause(true);

                            return interaction.editReply({ embeds: [client.successEmbed("Paused.", "⏸", "BLURPLE")] })
                        }
                        case "resume": {
                            if(player.playing) return interaction.editReply({ embeds: [client.errorEmbed("Music is already playing.")] });

                            await player.pause(false);

                            return interaction.editReply({ embeds: [client.successEmbed("Resumed.", "⏯", "BLURPLE")] })
                        }
                        case "stop": {
                            player.destroy()

                            return interaction.editReply({ embeds: [client.successEmbed("Disconnected", "⏹", "BLURPLE")] })
                        }
                        case "lyrics": {
                            if (!player.queue.current) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing playing.")] });

                            await interaction.editReply({ embeds: [client.successEmbed("Fetching lyrics", client.emojisObj.timer_loading, "BLURPLE")]})
							
                            const track = player.queue.current;
                            const trackTitle = track.title.replace("(Official Video)", "").replace("(Official Audio)", ""); 
                            const actualTrack = await gClient.songs.search(trackTitle);
                            const data = actualTrack[0];
                            const url = data.url;

                            if(!url) return interaction.editReply({embeds: [client.errorEmbed("The lyrics for this song was not found.")]})
							
							const lyrics = await extractLyrics(url)

                            const lyricsEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setTitle(`Lyrics for **${data.fullTitle}**`)
                                .setThumbnail(data.thumbnail)
                                .setDescription(`${lyrics.length < 4090 ? lyrics : `${lyrics.substring(0, 4090)}...`}`) 
                                .setFooter({ text: url })

                            return interaction.editReply({ embeds: [lyricsEmbed] })     
                        }
                        case "shuffle": {
                            if (!player.queue.length) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing in the queue.")] });

                            player.queue.shuffle()

                            return interaction.editReply({ embeds: [client.successEmbed("Shuffled the queue.", "🔀", "BLURPLE")] })
                        }

                        case "repeattrack":
                            if (!player.queue.current) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing playing.")] });

                            if(player.trackRepeat) {
                                await player.setTrackRepeat(false)
                                return interaction.editReply({ embeds: [client.successEmbed("Track repeat has been turned off.", "🔄", "BLURPLE")]})
                            } else {
                                await player.setTrackRepeat(true)
                                return interaction.editReply({ embeds: [client.successEmbed("Track repeat has been turned on.", "🔄", "BLURPLE")]})
                            }

                        case "queue": {
                            if (!player.queue.length) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing in the queue.")] });

                            const queue = player.queue.map((t, i) => `\`${++i}.\` **${t.title}** [${t.requester}]`);
                            const chunked = util.chunk(queue, 10).map(x => x.join("\n"));

                            const queueEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setTitle(`Current queue for ${guild.name}`)
                                .setDescription(chunked[0])

                            if(player.queueRepeat)
                                queueEmbed.setFooter({ text: "Queue repeat is on."})

                            return interaction.editReply({ embeds: [queueEmbed] });
                        }
                        case "clearqueue":
                            if (!player.queue.length) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing in the queue.")] });

                            music.queue.splice(0, 1);
                            
                            return interaction.editReply({ embeds: [client.successEmbed("The queue has been cleared.", "🔚", "BLURPLE")]})

                        case "queuerepeat":
                            if (!player.queue.length) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing in the queue.")] });

                            if(player.queueRepeat) {
                                await player.setQueueRepeat(false)
                                return interaction.editReply({ embeds: [client.successEmbed("Queue repeat has been turned off.", "🔄", "BLURPLE")]})
                            } else {
                                await player.setQueueRepeat(true)
                                return interaction.editReply({ embeds: [client.successEmbed("Queue repeat has been turned on.", "🔄", "BLURPLE")]})
                            }

                        case "statistics":
                            const node = player.node
                            if(!node.connected)
                                return interaction.editReply({embeds: [client.errorEmbed("The client is not connected to any nodes.")]})

                            const statistics = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setTitle(`Node statistics for ${node.options.host}`)
                                .addFields(
                                    {name: "CPU", value: `\`•\` **Cores**: \`${node.stats.cpu.cores}\` \n\`•\` **Lavalink load**: \`${node.stats.cpu.lavalinkLoad.toFixed(2)}%\` \n\`•\` **System load**: \`${node.stats.cpu.systemLoad.toFixed(2)}%\``, inline: true},
                                    {name: "Memory", value: `\`•\` **Allocated**: \`${(node.stats.memory.allocated / 10**9).toFixed(2)}GB\` \n\`•\` **Free**: \`${(node.stats.memory.free / 10**9).toFixed(2)}GB\` \n\`•\` **Used**: \`${(node.stats.memory.used / 10**9).toFixed(2)}GB\``, inline: true},
                                    {name: "‎", value: "‎", inline: true},
                                    {name: "Players", value: `\`•\` **Total**: \`${node.stats.players}\` \n\`•\` **Playing**: \`${node.stats.playingPlayers}\``, inline: true},
                                    {name: "Up since", value: `<t:${Math.trunc((Date.now() - node.stats.uptime) / 1000)}:R>`, inline: true},
                                    {name: "‎", value: "‎", inline: true},
                                )

                            return interaction.editReply({embeds: [statistics]})
                    }
                }
            }
        } catch (e) {
        //   if(e.message == "No result was found")
        //     return interaction.editReply({embeds: [client.errorEmbed("Lyrics for this song couldn't be found.")]})

          return interaction.editReply({embeds: [client.errorEmbed(`An error occured. \n \`\`\`${e.message}\`\`\``)]})
        }
    }
}