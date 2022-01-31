const { CommandInteraction, MessageEmbed, Client, Message, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { hypixel, errors } = require('../../structures/hypixel');
const commaNumber = require('comma-number');
const { pagination } = require("reconlx");
const { minecraft_embed_colour } = require("../../structures/config.json");
const DB = require("../../structures/schemas/hypixelStatsInteractionDB");

module.exports = {
    name: "hypixel",
    description: "Get stats about a hypixel player",
    whitelist: ["381791690454859778", "733646902083452949", "687292694451716102", "424954210866692099"],
    botCommandChannelOnly: true,
    options: [
        {
            name: "player",
            description: "General stats about a player",
            type: "SUB_COMMAND",
            options: [
                { 
                    name: "player", 
                    description: "Provide the name of the player", 
                    type: "STRING", 
                    required: true
                }
            ]
        },
        {
            name: "bedwars",
            description: "Bedwars stats",
            type: "SUB_COMMAND",
            options: [
                { 
                    name: "player", 
                    description: "Provide the name of the player", 
                    type: "STRING", 
                    required: true
                }
            ]
        },
        {
            name: "duels",
            description: "Duels stats",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "player", 
                    description: "Provide the name of the player", 
                    type: "STRING", 
                    required: true
                },
                { 
                    name: "mode", 
                    description: "Select a gamemode.", 
                    type: "STRING", 
                    required: true,
                    choices: [
                        {name: "Overall", value: "overall"},
                        {name: "Classic", value: "classic"},
                        {name: "UHC", value: "uhc"},
                        // {name: "Skywars", value: "skywars"},
                        // {name: "Bridge", value: "bridge"},
                        // {name: "Sumo", value: "sumo"},
                        // {name: "OP", value: "op"},
                        // {name: "Combo", value: "combo"},        
                    ]
                },
            ]
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const player = interaction.options.getString("player");
        
        switch(interaction.options.getSubcommand()) {
            case "player-information":
                hypixel.getPlayer(player, { guild: true }).then(async (player) => {
                    if (!player.isOnline) {
                        playerIsOnline = "Offline"
                    } else if (player.isOnline) {
                        playerIsOnline = "Online"
                    }
        
                    if (player.mcVersion == null) {
                        playerMinecraftVersion = "Unknown";
                    } else if (player.mcVersion != null) {
                        playerMinecraftVersion = player.mcVersion;
                    }
        
                    if (player.rank == 'Default') {
                        playerRank = "Default";
                    } else if (player.rank != 'Default') {
                        playerRank = player.rank;
                    }
                    
                    const playerEmbed = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Player Stats', iconURL: 'https://i.imgur.com/tRe29vU.jpeg'})
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                        `\`•\` **Level**: \`${commaNumber(player.level)}\`
                        \`•\` **AP**: \`${commaNumber(player.achievementPoints)}\`
                        \`•\` **Karma**: \`${commaNumber(player.karma)}\`
                        \`•\` **Rank**: \`${playerRank}\`
                        \`•\` **MC Version**: \`${playerMinecraftVersion}\`
                        `, true)

                    if (player.guild !== null && player.guild.tag == null) {
                        playerEmbed.setTitle(`[${player.rank}] ${player.nickname} [${player.guild.tag}]`)
                    } else {
                        playerEmbed.setTitle(`[${player.rank}] ${player.nickname}`)
                    }

                    if (player.guild !== null) {
                        playerEmbed.addField("Guild",
                        `\`•\` **Name**: \`${player.guild.name}\`
                        \`•\` **Level**: \`${commaNumber(player.guild.level)}\`
                        \`•\` **Tag**: \`[${commaNumber(player.guild.tag)}]\`
                        \`•\` **Weekly experience**: \`${commaNumber(player.guild.totalWeeklyGexp)}\`
                        `, true)
                    }

                    var socialMedias = ``
                    if(player.socialMedia) {
                        for (var i = 0; i < player.socialMedia.length; i++) {
                            socialMedias += `\`•\` **${player.socialMedia[i].name}**: \`${player.socialMedia[i].link}\`\n`
                        }
                    }
                    playerEmbed.addField("Socials", `${socialMedias}`)

                    playerEmbed.addField("Status",
                    `\`•\` **Status**: \`${playerIsOnline}\`
                    \`•\` **First Login**: <t:${player.firstLoginTimestamp.toString().slice(0, -3)}:R>
                    \`•\` **Last login**: <t:${player.lastLoginTimestamp.toString().slice(0, -3)}:R>
                    `, true)

                    await interaction.reply({ embeds: [playerEmbed], allowedMentions: { repliedUser: false } })   
                    

                }).catch(e => {
                    console.log(e)
                    if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                        const player404 = new MessageEmbed()
                            .setColor("RED")
                            .setDescription(`${client.emojisObj.animated_cross} I could not find that player in the API. Check spelling and name history.`)
                            interaction.reply({ embeds: [player404], allowedMentions: { repliedUser: false }, ephemeral: true })
                    } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                        const neverLogged = new MessageEmbed()
                            .setColor("RED")
                            .setDescription(`${client.emojisObj.animated_cross} That player has never logged into Hypixel.`)
                            interaction.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false }, ephemeral: true })
                    } else {
                        const error = new MessageEmbed()
                            .setColor("RED")
                            .setDescription(`${client.emojisObj.animated_cross} An error has occurred.`)
                            interaction.reply({ embeds: [error], allowedMentions: { repliedUser: false }, ephemeral: true })
                    }       
                });
                break;


            case "bedwars":
                hypixel.getPlayer(player).then(async(player) => {
                    const bedwarsOverall = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Overall Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`\n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`\n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\``, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.winstreak)}\`\n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.wins)}\`\n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.losses)}\`\n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.WLRatio)}\``, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.kills)}\`\n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.deaths)}\`\n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.KDRatio)}\``, true)
                        .addField("Finals",`\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.finalKills)}\`\n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.finalDeaths)}\`\n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.finalKDRatio)}\``, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.beds.broken)}\`\n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.beds.lost)}\`\n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.beds.BLRatio)}\``, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.avg.kills)}\`\n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.avg.finalKills)}\`\n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.avg.bedsBroken)}\``, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.losses*Math.ceil(player.stats.bedwars.WLRatio))-player.stats.bedwars.wins)}\`\n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.deaths*Math.ceil(player.stats.bedwars.KDRatio))-player.stats.bedwars.kills)}\`\n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.finalDeaths*Math.ceil(player.stats.bedwars.finalKDRatio))-player.stats.bedwars.finalKills)}\`\n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.beds.lost*Math.ceil(player.stats.bedwars.beds.BLRatio))-player.stats.bedwars.beds.broken)}\``, true)
                        .addField("Resources collected (All modes)", `\`•\` **Iron**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.iron)}\`\n\`•\` **Gold**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.gold)}\`\n\`•\` **Diamond**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.diamond)}\`\n\`•\` **Emerald**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.emerald)}\``, true)
                    
                    const bedwarsRow = new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId("bedwars-stats")
                            .setPlaceholder("Use this menu to select different modes.")
                            .addOptions([{ label: "Overall", value: "bedwars-overall" }, { label: "Solos", value: "bedwars-solos" }, { label: "Doubles", value: "bedwars-doubles" }, { label: "Threes", value: "bedwars-threes" }, { label: "Fours", value: "bedwars-fours" }, { label: "4v4", value: "bedwars-4v4" }, { label: "Ultimate Doubles", value: "bedwars-dream-ultimate-doubles" }, { label: "Ultimate Fours", value: "bedwars-dream-ultimate-fours" }, { label: "Rush Doubles", value: "bedwars-dream-rush-doubles" }, { label: "Rush Fours", value: "bedwars-dream-rush-fours" }, { label: "Armed Doubles", value: "bedwars-dream-armed-doubles" }, { label: "Armed Fours", value: "bedwars-dream-armed-fours" }, { label: "Lucky Doubles", value: "bedwars-dream-lucky-doubles" }, { label: "Lucky Fours", value: "bedwars-dream-lucky-fours" }, { label: "Voidless Doubles", value: "bedwars-dream-voidless-doubles" }, { label: "Voidless Fours", value: "bedwars-dream-voidless-fours" }])
                    )

                    const M = await interaction.reply({embeds: [bedwarsOverall], components: [bedwarsRow], fetchReply: true});

                    await DB.create({GuildID: interaction.guildId, MessageID: M.id, Player: player, TypeOfStats: "bedwars", InteractionMemberID: interaction.member.id})

                    setTimeout(async () => {
                        await interaction.editReply({components: []}).catch(() => {})
                        await DB.deleteOne({GuildID: interaction.guildId, MessageID: M.id, Player: player, TypeOfStats: "bedwars", InteractionMemberID: interaction.member.id})
                    }, 60 * 1000)


                }).catch(e => {
                    console.log(e)
                    if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                        const player404 = new MessageEmbed()
                            .setColor("RED")
                            .setDescription(`${client.emojisObj.animated_cross} I could not find that player in the API. Check spelling and name history.`)
                            interaction.reply({ embeds: [player404], allowedMentions: { repliedUser: false }, ephemeral: true })
                    } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                        const neverLogged = new MessageEmbed()
                            .setColor("RED")
                            .setDescription(`${client.emojisObj.animated_cross} That player has never logged into Hypixel.`)
                            interaction.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false }, ephemeral: true })
                    } else {
                        const error = new MessageEmbed()
                            .setColor("RED")
                            .setDescription(`${client.emojisObj.animated_cross} An error has occurred.`)
                            interaction.reply({ embeds: [error], allowedMentions: { repliedUser: false }, ephemeral: true })
                    }       
                });
                break;
            case "duels":
                const mode = interaction.options.getString("mode");
                switch(mode) {
                    case "overall":
                        hypixel.getPlayer(player).then((player) => {
                            const embed = new MessageEmbed()
                                .setColor(minecraft_embed_colour)
                                .setAuthor({name: 'Overall Duels Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                                .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.duels.division}`)
                                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                                .addField(' ​', `\`•\` **Matches**: \`${commaNumber(player.stats.duels.playedGames)}\`\n\`•\` **Coins**: \`${commaNumber(player.stats.duels.playedGames)}\`\n\`•\` **Winstreak**: \`${commaNumber(player.stats.duels.coins)}\`\n\`•\` **Best Winstreak**: \`${commaNumber(player.stats.duels.bestWinstreak)}\`\n\`•\` **Wins**: \`${commaNumber(player.stats.duels.wins)}\`\n\`•\` **Losses**: \`${commaNumber(player.stats.duels.losses)}\`\n\`•\` **WLR**: \`${commaNumber(player.stats.duels.WLRatio)}\`\n\`•\` **Kills**: \`${commaNumber(player.stats.duels.kills)}\`\n\`•\` **Deaths**: \`${commaNumber(player.stats.duels.deaths)}\`\n\`•\` **KDR**: \`${commaNumber(player.stats.duels.KDRatio)}\``, true)
                            interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                        }).catch(e => {
                            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                                const player404 = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`${client.emojisObj.animated_cross} I could not find that player in the API. Check spelling and name history.`)
                                    interaction.reply({ embeds: [player404], allowedMentions: { repliedUser: false }, ephemeral: true })
                            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                                const neverLogged = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`${client.emojisObj.animated_cross} That player has never logged into Hypixel.`)
                                    interaction.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false }, ephemeral: true })
                            } else {
                                const error = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`${client.emojisObj.animated_cross} An error has occurred.`)
                                    interaction.reply({ embeds: [error], allowedMentions: { repliedUser: false }, ephemeral: true })
                            }       
                        });
                        break;
                    case "classic":
                        hypixel.getPlayer(player).then((player) => {
                            const embed = new MessageEmbed()
                                .setColor(minecraft_embed_colour)
                                .setAuthor({name: 'Classic Duels Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                                .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.duels.classic.division}`)
                                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                                .addField(' ​', `\`•\` **Matches**: \`${commaNumber(player.stats.duels.classic.playedGames)}\`\n\`•\` **Coins**: \`${commaNumber(player.stats.duels.classic.playedGames)}\`\n\`•\` **Winstreak**: \`${commaNumber(player.stats.duels.classic.winstreak)}\`\n\`•\` **Best Winstreak**: \`${commaNumber(player.stats.duels.classic.bestWinstreak)}\`\n\`•\` **Wins**: \`${commaNumber(player.stats.duels.classic.wins)}\`\n\`•\` **Losses**: \`${commaNumber(player.stats.duels.classic.losses)}\`\n\`•\` **WLR**: \`${commaNumber(player.stats.duels.classic.WLRatio)}\`\n\`•\` **Kills**: \`${commaNumber(player.stats.duels.classic.kills)}\`\n\`•\` **Deaths**: \`${commaNumber(player.stats.duels.classic.deaths)}\`\n\`•\` **KDR**: \`${commaNumber(player.stats.duels.classic.KDRatio)}\``,true)
                            interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            
                        }).catch(e => {
                            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                                const player404 = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`${client.emojisObj.animated_cross} I could not find that player in the API. Check spelling and name history.`)
                                    interaction.reply({ embeds: [player404], allowedMentions: { repliedUser: false }, ephemeral: true })
                            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                                const neverLogged = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`${client.emojisObj.animated_cross} That player has never logged into Hypixel.`)
                                    interaction.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false }, ephemeral: true })
                            } else {
                                const error = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`${client.emojisObj.animated_cross} An error has occurred.`)
                                    interaction.reply({ embeds: [error], allowedMentions: { repliedUser: false }, ephemeral: true })
                            }       
                        });
                        break;
                    case "uhc":
                        hypixel.getPlayer(player).then((player) => {
                            const embed = new MessageEmbed()
                                .setColor(minecraft_embed_colour)
                                .setAuthor({name: `UHC Duels Stats | ${player.stats.duels.uhc.overall.division}`, iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                                .setTitle(`[${player.rank}] ${player.nickname}`)
                                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                                .addField('Overall', `\`•\` **Matches**: \`${commaNumber(player.stats.duels.uhc.overall.playedGames)}\` \n\`•\` **Best WS**: \`${commaNumber(player.stats.duels.uhc.overall.bestWinstreak)}\` \n\`•\` **Winstreak**: \`${commaNumber(player.stats.duels.uhc.overall.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.duels.uhc.overall.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.duels.uhc.overall.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.duels.uhc.overall.WLRatio)}\` \n\`•\` **Kills**: \`${commaNumber(player.stats.duels.uhc.overall.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.duels.uhc.overall.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.duels.uhc.overall.KDRatio)}\` `, true)
                                .addField('Solos', `\`•\` **Matches**: \`${commaNumber(player.stats.duels.uhc["1v1"].playedGames)}\` \n\`•\` **Best WS**: \`${commaNumber(player.stats.duels.uhc["1v1"].bestWinstreak)}\` \n\`•\` **Winstreak**: \`${commaNumber(player.stats.duels.uhc["1v1"].winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.duels.uhc["1v1"].wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.duels.uhc["1v1"].losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.duels.uhc["1v1"].WLRatio)}\` \n\`•\` **Kills**: \`${commaNumber(player.stats.duels.uhc["1v1"].kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.duels.uhc["1v1"].deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.duels.uhc["1v1"].KDRatio)}\` `, true)
                                .addField('Doubles', `\`•\` **Matches**: \`${commaNumber(player.stats.duels.uhc["2v2"].playedGames)}\` \n\`•\` **Best WS**: \`${commaNumber(player.stats.duels.uhc["2v2"].bestWinstreak)}\` \n\`•\` **Winstreak**: \`${commaNumber(player.stats.duels.uhc["2v2"].winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.duels.uhc["2v2"].wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.duels.uhc["2v2"].losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.duels.uhc["2v2"].WLRatio)}\` \n\`•\` **Kills**: \`${commaNumber(player.stats.duels.uhc["2v2"].kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.duels.uhc["2v2"].deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.duels.uhc["2v2"].KDRatio)}\` `, true)
                                .addField('Fours', `\`•\` **Matches**: \`${commaNumber(player.stats.duels.uhc["4v4"].playedGames)}\` \n\`•\` **Best WS**: \`${commaNumber(player.stats.duels.uhc["4v4"].bestWinstreak)}\` \n\`•\` **Winstreak**: \`${commaNumber(player.stats.duels.uhc["4v4"].winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.duels.uhc["4v4"].wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.duels.uhc["4v4"].losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.duels.uhc["4v4"].WLRatio)}\` \n\`•\` **Kills**: \`${commaNumber(player.stats.duels.uhc["4v4"].kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.duels.uhc["4v4"].deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.duels.uhc["4v4"].KDRatio)}\` `, true)
                                .addField('Fours', `\`•\` **Matches**: \`${commaNumber(player.stats.duels.uhc.meetup.playedGames)}\` \n\`•\` **Best WS**: \`${commaNumber(player.stats.duels.uhc.meetup.bestWinstreak)}\` \n\`•\` **Winstreak**: \`${commaNumber(player.stats.duels.uhc.meetup.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.duels.uhc.meetup.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.duels.uhc.meetup.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.duels.uhc.meetup.WLRatio)}\` \n\`•\` **Kills**: \`${commaNumber(player.stats.duels.uhc.meetup.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.duels.uhc.meetup.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.duels.uhc.meetup.KDRatio)}\` `, true)
                                .addField(` ​`, ` ​`, true)

                            interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                        }).catch(e => {
                            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                                const player404 = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`${client.emojisObj.animated_cross} I could not find that player in the API. Check spelling and name history.`)
                                    interaction.reply({ embeds: [player404], allowedMentions: { repliedUser: false }, ephemeral: true })
                            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                                const neverLogged = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`${client.emojisObj.animated_cross} That player has never logged into Hypixel.`)
                                    interaction.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false }, ephemeral: true })
                            } else {
                                const error = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`${client.emojisObj.animated_cross} An error has occurred.`)
                                    interaction.reply({embeds: [error], allowedMentions: { repliedUser: false }, ephemeral: true })
                            }       
                        });
                        break;
                }

        }
    }
}