const { CommandInteraction, MessageEmbed, Client, MessageButton } = require("discord.js");
const util = require("../../functions/erela.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client();

module.exports = {
    name: "music",
    description: "A complete music system",
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
                    { name: "🎦 | Now Playing", value: "nowplaying" },
                    { name: "🔚 | Clear Queue", value: "clearqueue" },
                ]
            }],
        }
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

        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: interaction.channelId,
            selfDeafen: true
        });

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
                case "settings": {
                    switch (options.getString("options")) {
                        case "skip": {
                            if (!player.queue.length) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing in the queue.")] });
                            await player.stop();

                            return interaction.editReply({ embeds: [client.successEmbed("Skipped.", "⏭", "BLURPLE")] });
                        }
                        case "nowplaying": {
                            if (!player.queue.current) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing playing.")] });
                            const track = player.queue.current;

                            const npEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setTitle("Now Playing")
                                .setDescription(`[${track.title}](${track.uri}) [${player.queue.current.requester}]`)
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

                            const track = player.queue.current;
                            const trackTitle = track.title.replace("(Official Video)", "").replace("(Official Audio)", "");              
                            const actualTrack = await gClient.songs.search(trackTitle);
                            const searches = actualTrack[0];
                            const lyrics = await searches.lyrics();

                            if(!lyrics) return interaction.editReply({embeds: [client.errorEmbed("The lyrics for this song was not found.")]})

                            const lyricsEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setTitle(`Lyrics for **${trackTitle}**`)
                                .setDescription(`${lyrics.length < 4090 ? lyrics : `${lyrics.substring(0, 4090)}...`}`) 

                            return interaction.editReply({ embeds: [lyricsEmbed] })     
                        }
                        case "shuffle": {
                            if (!player.queue.length) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing in the queue.")] });

                            player.queue.shuffle()

                            return interaction.editReply({ embeds: [client.successEmbed("Shuffled the queue.", "🔀", "BLURPLE")] })
                        }
                        case "queue": {
                            if (!player.queue.length) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing in the queue.")] });

                            const queue = player.queue.map((t, i) => `\`${++i}.\` **${t.title}** [${t.requester}]`);
                            const chunked = util.chunk(queue, 10).map(x => x.join("\n"));

                            const queueEmbed = new MessageEmbed()
                                .setColor("BLURPLE")
                                .setTitle(`Current queue for ${guild.name}`)
                                .setDescription(chunked[0])

                            return interaction.editReply({ embeds: [queueEmbed] });
                        }
                        case "clearqueue":
                            if (!player.queue.length) return interaction.editReply({ embeds: [client.errorEmbed("There is nothing in the queue.")] });

                            music.queue.splice(0, 1);
                            
                            return interaction.editReply({ embeds: [client.successEmbed("The queue has been cleared.", "🔚", "BLURPLE")]})
                    }
                }
            }
        } catch (e) {
          if(e.message == "No result was found")
            return interaction.editReply({embeds: [client.errorEmbed("Lyrics for this song couldn't be found.")]})

          return interaction.editReply({embeds: [client.errorEmbed(`An error occured. \n \`\`\`${e.message}\`\`\``)]})
        }
    }
}