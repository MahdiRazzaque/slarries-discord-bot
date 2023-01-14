const { CommandInteraction, MessageEmbed, Client, Message, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { hypixel, errors } = require('../../structures/hypixel');
const commaNumber = require('comma-number');
const fetch = require("node-fetch-commonjs")
const { minecraft_embed_colour } = require("../../structures/config.json");
const DB = require("../../structures/schemas/hypixelStatsInteractionDB");
const linkDB = require("../../structures/schemas/hypixelLinkingDB");

module.exports = {
    name: "hypixel",
    description: "Get stats about a hypixel player",
    usage: "/hypixel",
    botCommandChannelOnly: true,
    options: [
        {
            name: "link",
            description: "Link your account to this bot.",
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
            name: "unlink",
            description: "Unlink your account to this bot.",
            type: "SUB_COMMAND",
        },
        {
            name: "player",
            description: "General stats about a player",
            type: "SUB_COMMAND",
            options: [
                { 
                    name: "player", 
                    description: "Provide the name of the player", 
                    type: "STRING", 
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
                }
            ]
        },
        {
            name: "duels",
            description: "Duels stats",
            type: "SUB_COMMAND",
            options: [
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
                        {name: "Bridge", value: "bridge"},
                        // {name: "Sumo", value: "sumo"},
                        // {name: "OP", value: "op"},
                        // {name: "Combo", value: "combo"},        
                    ]
                },
                {
                    name: "player", 
                    description: "Provide the name of the player", 
                    type: "STRING", 
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

        function errorHandling (e) {
            console.log(e)
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} I could not find that player in the API. Check spelling and name history.`)], allowedMentions: { repliedUser: false }, ephemeral: true })
            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} That player has never logged into Hypixel.`)], allowedMentions: { repliedUser: false }, ephemeral: true })
            } else { 
                return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} An error has occurred.`)], allowedMentions: { repliedUser: false }, ephemeral: true })
            }   
        }

        const data = await linkDB.findOne({id: interaction.member.id});
        var player = interaction.options.getString("player");

        if(data && !player) {
            player = data.uuid
        } else if (player) {
            player = player
        } else {
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You did not provide a valid player or you haven't linked your account. \n\n If you would like to like your account, use /hypixel link`).setFooter({text: ""})]})
        }
        
        switch(interaction.options.getSubcommand()) {
            case "link":
                const linkUser = await linkDB.findOne({ id: interaction.member.id });
                if (linkUser && linkUser.uuid) {
                  return interaction.reply({ embeds: [new MessageEmbed().setDescription(`${client.emojisObj.animated_cross} Your account is already connected!`)]})
                }
                hypixel.getPlayer(player).then(async (player) => {
                    if (!player.socialMedia.find((s) => s.id === 'DISCORD')) {
                      return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This minecraft account does not have a discord account connected to it.\n\nWatch the GIF to learn how to connect your discord account.`).setImage('https://thumbs.gfycat.com/DentalTemptingLeonberger-size_restricted.gif')]})
                    }

                    if (player.socialMedia.find((s) => s.id === 'DISCORD').link !== interaction.user.tag) {
                      return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} ${player.nickname}'s connected discord tag doesn't match your discord tag.`)]})
                    }

                    const user1 = await linkDB.findOne({ uuid: player.uuid });
                    if (user1) {                      
                      return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} That player has already been linked to another account.`)]})
                    }

                    new linkDB({ id: interaction.member.id, uuid: player.uuid }).save(() => {
                        interaction.reply({ embeds: [new MessageEmbed().setColor(minecraft_embed_colour).setDescription(`${client.emojisObj.animated_tick} ${player.nickname} has been successfully linked to your account.`)]})
                      });
                }).catch(e => {return errorHandling(e)});

            break;
            case "unlink":
                const unlinkUser = await linkDB.findOne({ id: interaction.member.id });
                if (!unlinkUser) {
                  return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} This discord account does not have a minecraft account linked to it.`) .setImage('https://thumbs.gfycat.com/DentalTemptingLeonberger-size_restricted.gif')]})
                }
        
                const username = await fetch(`https://playerdb.co/api/player/minecraft/${unlinkUser.uuid}`).then(res => res.json())
        
                unlinkUser.deleteOne(() => {
                return interaction.reply({ embeds: [new MessageEmbed().setColor(minecraft_embed_colour) .setDescription(`${client.emojisObj.animated_tick} ${username.data.player.username} has been successfully been unlinked from your account.`)]})
                });
            break;

            case "player":
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
                        .addField("General Stats", `\`•\` **Level**: \`${commaNumber(player.level)}\` \n\`•\` **AP**: \`${commaNumber(player.achievementPoints)}\` \n\`•\` **Karma**: \`${commaNumber(player.karma)}\` \n\`•\` **Rank**: \`${playerRank}\` \n\`•\` **MC Version**: \`${playerMinecraftVersion}\` `, true)

                    if (player.guild) {
                        const guildRank = player.guild.me.rank || "None"
                        const guildTag = player.guild.tag || "None"

                        playerEmbed.setTitle(`[${player.rank}] ${player.nickname}`)
                        playerEmbed.addField("Guild", `\`•\` **Name**: \`${player.guild.name}\` \n\`•\` **Rank**: \`${guildRank}\` \n\`•\` **Level**: \`${commaNumber(player.guild.level)}\` \n\`•\` **Tag**: \`${guildTag}\``, true)
                    }

                    var socialMedias = ``
                    if(player.socialMedia.length != 0) {
                        for (var i = 0; i < player.socialMedia.length; i++) {
                            if(player.socialMedia[i].id === "DISCORD") {
                                socialMedias += `\`•\` **${player.socialMedia[i].name}**: \`${player.socialMedia[i].link}\`\n`
                            } else {
                                socialMedias += `\`•\` **${player.socialMedia[i].name}**: [link](${player.socialMedia[i].link})\n`
                            }
                            
                        }
                        playerEmbed.addField("Socials", `${socialMedias}`)
                    } else {
                        playerEmbed.addField("Socials", `\`No social medias connected\``)
                    }
                    
                    if (!player.lastLoginTimestamp) {
                        lastLoginTimestamp = "\`Unknown\`"
                    } else {
                        lastLoginTimestamp = `<t:${player.lastLoginTimestamp.toString().slice(0, -3)}:R>`
                    }
                    
                    playerEmbed.addField("Status", `\`•\` **Status**: \`${playerIsOnline}\` \n\`•\` **First Login**: <t:${player.firstLoginTimestamp.toString().slice(0, -3)}:R> \n\`•\` **Last login**: ${lastLoginTimestamp} \n\`•\` **Last played**: \`${player.recentlyPlayedGame || "Unknown"}\` `, true)

                    await interaction.reply({ embeds: [playerEmbed]})   
                    
                }).catch(e => {return errorHandling(e)});
                break;

            case "bedwars":
                hypixel.getPlayer(player).then(async(player) => {

                  var bedwarsEmbedColour = "GREYPLE"
                  star = player.stats.bedwars.level
                  switch (Math.floor(star/100)) {
                    case 0:
                    	bedwarsEmbedColour = "GREYPLE"
                      break;
                    case 1:
                    	bedwarsEmbedColour = "WHITE"
                      break;
                    case 2:
                      bedwarsEmbedColour = "GOLD"
                      break;
                   	case 3:
                      bedwarsEmbedColour = "AQUA"
                      break;
                    case 4:
                      bedwarsEmbedColour = "GREEN"
                      break;
                    case 5:
                      bedwarsEmbedColour = "DARK_BLUE"
                      break;
                    case 6:
                      bedwarsEmbedColour = "DARK_RED"
                      break;
                    case 7:
                      bedwarsEmbedColour = "LUMINOUS_VIVID_PINK"
                      break;
                    case 8:
                      bedwarsEmbedColour = "DARK_BLUE"
                      break;
                    case 9:
                      bedwarsEmbedColour = "DARK_PURPLE"
                      break;
                    default:
                      bedwarsEmbedColour = "YELLOW"
                  }
                  
                    const bedwarsOverall = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Overall Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`\n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`\n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\``, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.winstreak)}\`\n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.wins)}\`\n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.losses)}\`\n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.WLRatio)}\``, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.kills)}\`\n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.deaths)}\`\n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.KDRatio)}\``, true)
                        .addField("Finals",`\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.finalKills)}\`\n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.finalDeaths)}\`\n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.finalKDRatio)}\``, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.beds.broken)}\`\n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.beds.lost)}\`\n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.beds.BLRatio)}\``, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.avg.kills)}\`\n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.avg.finalKills)}\`\n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.avg.bedsBroken)}\``, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.losses*Math.ceil(player.stats.bedwars.WLRatio))-player.stats.bedwars.wins)}\`\n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.deaths*Math.ceil(player.stats.bedwars.KDRatio))-player.stats.bedwars.kills)}\`\n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.finalDeaths*Math.ceil(player.stats.bedwars.finalKDRatio))-player.stats.bedwars.finalKills)}\`\n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.beds.lost*Math.ceil(player.stats.bedwars.beds.BLRatio))-player.stats.bedwars.beds.broken)}\``, true)
                        .addField("Resources collected (All modes)", `\`•\` **Iron**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.iron)}\`\n\`•\` **Gold**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.gold)}\`\n\`•\` **Diamond**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.diamond)}\`\n\`•\` **Emerald**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.emerald)}\``, true)
                    
                    const bedwarsRow = new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId("bedwars-stats")
                            .setPlaceholder("Use this menu to select different modes.")
                            .addOptions([{ label: "Overall", value: "bedwars-overall" }, { label: "Solos", value: "bedwars-solos" }, { label: "Doubles", value: "bedwars-doubles" }, { label: "Threes", value: "bedwars-threes" }, { label: "Fours", value: "bedwars-fours" }, { label: "4v4", value: "bedwars-4v4" }, { label: "Ultimate Doubles", value: "bedwars-dream-ultimate-doubles" }, { label: "Ultimate Fours", value: "bedwars-dream-ultimate-fours" }, { label: "Rush Doubles", value: "bedwars-dream-rush-doubles" }, { label: "Rush Fours", value: "bedwars-dream-rush-fours" }, { label: "Armed Doubles", value: "bedwars-dream-armed-doubles" }, { label: "Armed Fours", value: "bedwars-dream-armed-fours" }, { label: "Lucky Doubles", value: "bedwars-dream-lucky-doubles" }, { label: "Lucky Fours", value: "bedwars-dream-lucky-fours" }, { label: "Voidless Doubles", value: "bedwars-dream-voidless-doubles" }, { label: "Voidless Fours", value: "bedwars-dream-voidless-fours" }])
                    )

                    const M = await interaction.reply({embeds: [bedwarsOverall], components: [bedwarsRow], fetchReply: true});

                    await DB.create({GuildID: interaction.guildId, ChannelID: interaction.channel.id, MessageID: M.id, Player: player, TypeOfStats: "bedwars", InteractionMemberID: interaction.member.id, DateOpened: Date.now()})

                    setTimeout(async () => {
                        await interaction.editReply({components: []}).catch(() => {})
                        await DB.deleteOne({GuildID: interaction.guildId, MessageID: M.id, Player: player, TypeOfStats: "bedwars", InteractionMemberID: interaction.member.id})
                    }, 60 * 1000)

                }).catch(e => {return errorHandling(e)});
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
                                .addField(' ​', `\`•\` **Matches**: \`${commaNumber(player.stats.duels.playedGames)}\`\n\`•\` **Coins**: \`${commaNumber(player.stats.duels.coins)}\`\n\`•\` **Winstreak**: \`${commaNumber(player.stats.duels.winstreak)}\`\n\`•\` **Best Winstreak**: \`${commaNumber(player.stats.duels.bestWinstreak)}\`\n\`•\` **Wins**: \`${commaNumber(player.stats.duels.wins)}\`\n\`•\` **Losses**: \`${commaNumber(player.stats.duels.losses)}\`\n\`•\` **WLR**: \`${commaNumber(player.stats.duels.WLRatio)}\`\n\`•\` **Kills**: \`${commaNumber(player.stats.duels.kills)}\`\n\`•\` **Deaths**: \`${commaNumber(player.stats.duels.deaths)}\`\n\`•\` **KDR**: \`${commaNumber(player.stats.duels.KDRatio)}\``, true)
                            interaction.reply({ embeds: [embed]});
                        }).catch(e => {return errorHandling(e)});
                        break;

                    case "classic":
                        hypixel.getPlayer(player).then((player) => {
                            const embed = new MessageEmbed()
                                .setColor(minecraft_embed_colour)
                                .setAuthor({name: 'Classic Duels Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                                .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.duels.classic.division}`)
                                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                                .addField(' ​', `\`•\` **Matches**: \`${commaNumber(player.stats.duels.classic.playedGames)}\`\n\`•\` **Coins**: \`${commaNumber(player.stats.duels.classic.playedGames)}\`\n\`•\` **Winstreak**: \`${commaNumber(player.stats.duels.classic.winstreak)}\`\n\`•\` **Best Winstreak**: \`${commaNumber(player.stats.duels.classic.bestWinstreak)}\`\n\`•\` **Wins**: \`${commaNumber(player.stats.duels.classic.wins)}\`\n\`•\` **Losses**: \`${commaNumber(player.stats.duels.classic.losses)}\`\n\`•\` **WLR**: \`${commaNumber(player.stats.duels.classic.WLRatio)}\`\n\`•\` **Kills**: \`${commaNumber(player.stats.duels.classic.kills)}\`\n\`•\` **Deaths**: \`${commaNumber(player.stats.duels.classic.deaths)}\`\n\`•\` **KDR**: \`${commaNumber(player.stats.duels.classic.KDRatio)}\``,true)
                            interaction.reply({ embeds: [embed]});
            
                        }).catch(e => {return errorHandling(e)});
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

                            interaction.reply({ embeds: [embed]});
                        }).catch(e => {return errorHandling(e)});
                        break;

                    case "bridge":
                        hypixel.getPlayer(player).then(async (player) => {
                            const bridgeOverall = new MessageEmbed()
                                .setColor(minecraft_embed_colour)
                                .setAuthor({name: `Overall Bridge Stats`, iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                                .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.duels.bridge.overall.division}`)
                                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                                .addField("Games", `\`•\` **Best WS**: \`${commaNumber(player.stats.duels.bridge.overall.bestWinstreak)}\`\n \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.bridge.overall.winstreak)}\`\n \`•\` **Wins**: \`${commaNumber(player.stats.duels.bridge.overall.wins)}\`\n \`•\` **Losses**: \`${commaNumber(player.stats.duels.bridge.overall.losses)}\`\n \`•\` **WLR**: \`${commaNumber(player.stats.duels.bridge.overall.WLRatio)}\``, true)
                                .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.duels.bridge.overall.kills)}\`\n \`•\` **Deaths**: \`${commaNumber(player.stats.duels.bridge.overall.deaths)}\`\n \`•\` **KDR**: \`${commaNumber(player.stats.duels.bridge.overall.KDRatio)}\``, true)
                                .addField("Milstones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.duels.bridge.overall.WLRatio))} WLR**: \`${commaNumber((player.stats.duels.bridge.overall.losses*Math.ceil(player.stats.duels.bridge.overall.WLRatio))-player.stats.duels.bridge.overall.wins)}\`\n \`•\` **Kills to ${commaNumber(Math.ceil(player.stats.duels.bridge.overall.KDRatio))} KDR**: \`${commaNumber((player.stats.duels.bridge.overall.deaths*Math.ceil(player.stats.duels.bridge.overall.KDRatio))-player.stats.duels.bridge.overall.kills)}\``, true)

                            if(player.stats.duels.bridge.overall.wins > 50)
                                bridgeOverall.setColor("GREY")
                    
                            if(player.stats.duels.bridge.overall.wins > 100)
                                bridgeOverall.setColor("LIGHT_GREY")
                    
                            if(player.stats.duels.bridge.overall.wins > 250)
                                bridgeOverall.setColor("GOLD")
                    
                            if(player.stats.duels.bridge.overall.wins > 500)
                                bridgeOverall.setColor("DARK_AQUA")
                    
                            if(player.stats.duels.bridge.overall.wins > 1000)
                                bridgeOverall.setColor("DARK_GREEN")
                            
                            if(player.stats.duels.bridge.overall.wins > 2000)
                                bridgeOverall.setColor("DARK_RED")
                            
                            if(player.stats.duels.bridge.overall.wins > 5000)
                                bridgeOverall.setColor("GOLD")
                    
                            if(player.stats.duels.bridge.overall.wins > 10000)
                                bridgeOverall.setColor("DARK_PURPLE")

                            const bridgeRow = new MessageActionRow().addComponents(
                                new MessageSelectMenu()
                                    .setCustomId("bridge-stats")
                                    .setPlaceholder("Use this menu to select different modes.")
                                    .addOptions([{ label: "Overall", value: "bridge-overall" }, { label: "1v1", value: "bridge-1v1" }, { label: "2v2", value: "bridge-2v2" }, { label: "3v3", value: "bridge-3v3" }, { label: "4v4", value: "bridge-4v4" }, { label: "2v2v2v2", value: "bridge-2v2v2v2" }, { label: "3v3v3v3", value: "bridge-3v3v3v3" }, { label: "Capture the flag", value: "bridge-ctf" }])
                            )
                            
                            const M = await interaction.reply({embeds: [bridgeOverall], components: [bridgeRow], fetchReply: true})

                            await DB.create({GuildID: interaction.guildId, ChannelID:interaction.channel.id , MessageID: M.id, Player: player, TypeOfStats: "bridge", InteractionMemberID: interaction.member.id, DateOpened: Date.now()})
        
                            setTimeout(async () => {
                                await interaction.editReply({components: []}).catch(() => {})
                                await DB.deleteOne({GuildID: interaction.guildId, ChannelID: interaction.channel.id, MessageID: M.id, Player: player, TypeOfStats: "bridge", InteractionMemberID: interaction.member.id, DateOpened: Date.Now()})
                            }, 60 * 1000)
                            
                        }).catch(e => {return errorHandling(e)});
                        break;
                }

        }
    }
}