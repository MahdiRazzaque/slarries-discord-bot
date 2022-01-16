const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const { hypixel, errors } = require('../../structures/hypixel');
const commaNumber = require('comma-number');
const { minecraft_embed_colour } = require("../../structures/config.json")

module.exports = {
    name: "hypixel",
    description: "Get stats about a hypixel player",
    permission: "ADMINISTRATOR",
    options: [
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
                        {name: "Skywars", value: "skywars"},
                        {name: "Bridge", value: "bridge"},
                        {name: "Sumo", value: "sumo"},
                        {name: "OP", value: "op"},
                        {name: "Combo", value: "combo"},        
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
            case "bedwars":
                hypixel.getPlayer(player).then((player) => {
                    const embed = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'BedWars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   [${player.stats.bedwars.level}✫]   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField(`Overall`, 
                        `\`•\` **Matches**: \`${commaNumber(player.stats.bedwars.playedGames)}\`
                        \`•\` **WS**: \`${commaNumber(player.stats.bedwars.winstreak)}\`
                        \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.wins)}\`
                        \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.losses)}\`
                        \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.WLRatio)}\`
                        \`•\` **Kills**: \`${commaNumber(player.stats.bedwars.kills)}\`
                        \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.deaths)}\`
                        \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.KDRatio)}\`
                        \`•\` **FKs**: \`${commaNumber(player.stats.bedwars.finalKills)}\`
                        \`•\` **FDs**: \`${commaNumber(player.stats.bedwars.finalDeaths)}\`
                        \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.finalKDRatio)}\`
                        \`•\` **Iron**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.iron)}\`
                        \`•\` **Gold**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.gold)}\`
                        \`•\` **Diamond**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.diamond)}\`
                        \`•\` **Emerald**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.emerald)}\`
                        \`•\` **F/G**: \`${commaNumber(player.stats.bedwars.avg.finalKills)}\`
                        \`•\` **B/G**: \`${commaNumber(player.stats.bedwars.avg.bedsBroken)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.losses*Math.ceil(player.stats.bedwars.WLRatio))-player.stats.bedwars.wins)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.finalDeaths*Math.ceil(player.stats.bedwars.finalKDRatio))-player.stats.bedwars.finalKills)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.beds.lost*Math.ceil(player.stats.bedwars.beds.BLRatio))-player.stats.bedwars.beds.broken)}\`
                        `, true)
                    .addField(`Solos`, 
                        `\`•\` **Matches**: \`${commaNumber(player.stats.bedwars.solo.playedGames)}\`
                        \`•\` **WS**: \`${commaNumber(player.stats.bedwars.solo.winstreak)}\`
                        \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.solo.wins)}\`
                        \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.solo.losses)}\`
                        \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.solo.WLRatio)}\`
                        \`•\` **Kills**: \`${commaNumber(player.stats.bedwars.solo.kills)}\`
                        \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.solo.deaths)}\`
                        \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.solo.KDRatio)}\`
                        \`•\` **FKs**: \`${commaNumber(player.stats.bedwars.solo.finalKills)}\`
                        \`•\` **FDs**: \`${commaNumber(player.stats.bedwars.solo.finalDeaths)}\`
                        \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.solo.finalKDRatio)}\`
                        \`•\` **F/G**: \`${commaNumber(player.stats.bedwars.solo.avg.finalKills)}\`
                        \`•\` **B/G**: \`${commaNumber(player.stats.bedwars.solo.avg.bedsBroken)}\`
                        \`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.solo.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.solo.losses*Math.ceil(player.stats.bedwars.solo.WLRatio))-player.stats.bedwars.solo.wins)}\`
                        \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.solo.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.solo.finalDeaths*Math.ceil(player.stats.bedwars.solo.finalKDRatio))-player.stats.bedwars.solo.finalKills)}\`
                        \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.solo.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.solo.beds.lost*Math.ceil(player.stats.bedwars.solo.beds.BLRatio))-player.stats.bedwars.solo.beds.broken)}\`
                        `, true)
                    .addField(`Doubles`, 
                        `\`•\` **Matches**: \`${commaNumber(player.stats.bedwars.doubles.playedGames)}\`
                        \`•\` **WS**: \`${commaNumber(player.stats.bedwars.doubles.winstreak)}\`
                        \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.doubles.wins)}\`
                        \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.doubles.losses)}\`
                        \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.doubles.WLRatio)}\`
                        \`•\` **Kills**: \`${commaNumber(player.stats.bedwars.doubles.kills)}\`
                        \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.doubles.deaths)}\`
                        \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.doubles.KDRatio)}\`
                        \`•\` **FKs**: \`${commaNumber(player.stats.bedwars.doubles.finalKills)}\`
                        \`•\` **FDs**: \`${commaNumber(player.stats.bedwars.doubles.finalDeaths)}\`
                        \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.doubles.finalKDRatio)}\`
                        \`•\` **F/G**: \`${commaNumber(player.stats.bedwars.doubles.avg.finalKills)}\`
                        \`•\` **B/G**: \`${commaNumber(player.stats.bedwars.doubles.avg.bedsBroken)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.doubles.losses*Math.ceil(player.stats.bedwars.doubles.WLRatio))-player.stats.bedwars.doubles.wins)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.doubles.finalDeaths*Math.ceil(player.stats.bedwars.doubles.finalKDRatio))-player.stats.bedwars.doubles.finalKills)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.doubles.beds.lost*Math.ceil(player.stats.bedwars.doubles.beds.BLRatio))-player.stats.bedwars.doubles.beds.broken)}\`
                        `, true)
                    .addField(`Threes`, 
                        `\`•\` **Matches**: \`${commaNumber(player.stats.bedwars.threes.playedGames)}\`
                        \`•\` **WS**: \`${commaNumber(player.stats.bedwars.threes.winstreak)}\`
                        \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.threes.wins)}\`
                        \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.threes.losses)}\`
                        \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.threes.WLRatio)}\`
                        \`•\` **Kills**: \`${commaNumber(player.stats.bedwars.threes.kills)}\`
                        \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.threes.deaths)}\`
                        \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.threes.KDRatio)}\`
                        \`•\` **FKs**: \`${commaNumber(player.stats.bedwars.threes.finalKills)}\`
                        \`•\` **FDs**: \`${commaNumber(player.stats.bedwars.threes.finalDeaths)}\`
                        \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.threes.finalKDRatio)}\`
                        \`•\` **F/G**: \`${commaNumber(player.stats.bedwars.threes.avg.finalKills)}\`
                        \`•\` **B/G**: \`${commaNumber(player.stats.bedwars.threes.avg.bedsBroken)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars.threes.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.threes.losses*Math.ceil(player.stats.bedwars.threes.WLRatio))-player.stats.bedwars.threes.wins)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars.threes.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.threes.finalDeaths*Math.ceil(player.stats.bedwars.threes.finalKDRatio))-player.stats.bedwars.threes.finalKills)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars.threes.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.threes.beds.lost*Math.ceil(player.stats.bedwars.threes.beds.BLRatio))-player.stats.bedwars.threes.beds.broken)}\`
                        `, true)
                    .addField(`Fours`, 
                        `\`•\` **Matches**: \`${commaNumber(player.stats.bedwars.fours.playedGames)}\`
                        \`•\` **WS**: \`${commaNumber(player.stats.bedwars.fours.winstreak)}\`
                        \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.fours.wins)}\`
                        \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.fours.losses)}\`
                        \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.fours.WLRatio)}\`
                        \`•\` **Kills**: \`${commaNumber(player.stats.bedwars.fours.kills)}\`
                        \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.fours.deaths)}\`
                        \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.fours.KDRatio)}\`
                        \`•\` **FKs**: \`${commaNumber(player.stats.bedwars.fours.finalKills)}\`
                        \`•\` **FDs**: \`${commaNumber(player.stats.bedwars.fours.finalDeaths)}\`
                        \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.fours.finalKDRatio)}\`
                        \`•\` **F/G**: \`${commaNumber(player.stats.bedwars.fours.avg.finalKills)}\`
                        \`•\` **B/G**: \`${commaNumber(player.stats.bedwars.fours.avg.bedsBroken)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.fours.losses*Math.ceil(player.stats.bedwars.fours.WLRatio))-player.stats.bedwars.fours.wins)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.fours.finalDeaths*Math.ceil(player.stats.bedwars.fours.finalKDRatio))-player.stats.bedwars.fours.finalKills)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.fours.beds.lost*Math.ceil(player.stats.bedwars.fours.beds.BLRatio))-player.stats.bedwars.fours.beds.broken)}\`
                        `, true)
                    .addField(`4v4`, 
                        `\`•\` **Matches**: \`${commaNumber(player.stats.bedwars["4v4"].playedGames)}\`
                        \`•\` **WS**: \`${commaNumber(player.stats.bedwars["4v4"].winstreak)}\`
                        \`•\` **Wins**: \`${commaNumber(player.stats.bedwars["4v4"].wins)}\`
                        \`•\` **Losses**: \`${commaNumber(player.stats.bedwars["4v4"].losses)}\`
                        \`•\` **WLR**: \`${commaNumber(player.stats.bedwars["4v4"].WLRatio)}\`
                        \`•\` **Kills**: \`${commaNumber(player.stats.bedwars["4v4"].kills)}\`
                        \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars["4v4"].deaths)}\`
                        \`•\` **KDR**: \`${commaNumber(player.stats.bedwars["4v4"].KDRatio)}\`
                        \`•\` **FKs**: \`${commaNumber(player.stats.bedwars["4v4"].finalKills)}\`
                        \`•\` **FDs**: \`${commaNumber(player.stats.bedwars["4v4"].finalDeaths)}\`
                        \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars["4v4"].finalKDRatio)}\`
                        \`•\` **F/G**: \`${commaNumber(player.stats.bedwars["4v4"].avg.finalKills)}\`
                        \`•\` **B/G**: \`${commaNumber(player.stats.bedwars["4v4"].avg.bedsBroken)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars["4v4"].WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars["4v4"].losses*Math.ceil(player.stats.bedwars["4v4"].WLRatio))-player.stats.bedwars["4v4"].wins)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars["4v4"].finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars["4v4"].finalDeaths*Math.ceil(player.stats.bedwars["4v4"].finalKDRatio))-player.stats.bedwars["4v4"].finalKills)}\`
                        \`•\` **Till ${commaNumber(Math.ceil(player.stats.bedwars["4v4"].beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars["4v4"].beds.lost*Math.ceil(player.stats.bedwars["4v4"].beds.BLRatio))-player.stats.bedwars["4v4"].beds.broken)}\`
                        `, true)
                      
                    interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                }).catch(e => {
                    if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                        const player404 = new MessageEmbed()
                            .setColor("RED")
                            .setDescription('<a:animated_cross:925091847905366096> I could not find that player in the API. Check spelling and name history.')
                            interaction.reply({ embeds: [player404], allowedMentions: { repliedUser: false }, ephemeral: true })
                    } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                        const neverLogged = new MessageEmbed()
                            .setColor("RED")
                            .setDescription('<a:animated_cross:925091847905366096> That player has never logged into Hypixel.')
                            interaction.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false }, ephemeral: true })
                    } else {
                        const error = new MessageEmbed()
                            .setColor("RED")
                            .setDescription(`<a:animated_cross:925091847905366096> An error has occurred. ${e}`)
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
                                .addField(' ​', 
                                    `\`•\` **Matches**: \`${commaNumber(player.stats.duels.playedGames)}\`
                                    \`•\` **Coins**: \`${commaNumber(player.stats.duels.playedGames)}\`
                                    \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.coins)}\`
                                    \`•\` **Best Winstreak**: \`${commaNumber(player.stats.duels.bestWinstreak)}\`
                                    \`•\` **Wins**: \`${commaNumber(player.stats.duels.wins)}\`
                                    \`•\` **Losses**: \`${commaNumber(player.stats.duels.losses)}\`
                                    \`•\` **WLR**: \`${commaNumber(player.stats.duels.WLRatio)}\`
                                    \`•\` **Kills**: \`${commaNumber(player.stats.duels.kills)}\`
                                    \`•\` **Deaths**: \`${commaNumber(player.stats.duels.deaths)}\`
                                    \`•\` **KDR**: \`${commaNumber(player.stats.duels.KDRatio)}\`
                                    `,
                                    true)
                            interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                        }).catch(e => {
                            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                                const player404 = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription('<a:animated_cross:925091847905366096> I could not find that player in the API. Check spelling and name history.')
                                    interaction.reply({ embeds: [player404], allowedMentions: { repliedUser: false }, ephemeral: true })
                            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                                const neverLogged = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription('<a:animated_cross:925091847905366096> That player has never logged into Hypixel.')
                                    interaction.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false }, ephemeral: true })
                            } else {
                                const error = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`<a:animated_cross:925091847905366096> An error has occurred. \n ${e}`)
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
                                .addField(' ​', 
                                `\`•\` **Matches**: \`${commaNumber(player.stats.duels.classic.playedGames)}\`
                                \`•\` **Coins**: \`${commaNumber(player.stats.duels.classic.playedGames)}\`
                                \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.classic.winstreak)}\`
                                \`•\` **Best Winstreak**: \`${commaNumber(player.stats.duels.classic.bestWinstreak)}\`
                                \`•\` **Wins**: \`${commaNumber(player.stats.duels.classic.wins)}\`
                                \`•\` **Losses**: \`${commaNumber(player.stats.duels.classic.losses)}\`
                                \`•\` **WLR**: \`${commaNumber(player.stats.duels.classic.WLRatio)}\`
                                \`•\` **Kills**: \`${commaNumber(player.stats.duels.classic.kills)}\`
                                \`•\` **Deaths**: \`${commaNumber(player.stats.duels.classic.deaths)}\`
                                \`•\` **KDR**: \`${commaNumber(player.stats.duels.classic.KDRatio)}\`
                                `,
                                true)
                            interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            
                        }).catch(e => {
                            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                                const player404 = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription('<a:animated_cross:925091847905366096> I could not find that player in the API. Check spelling and name history.')
                                    interaction.reply({ embeds: [player404], allowedMentions: { repliedUser: false }, ephemeral: true })
                            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                                const neverLogged = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription('<a:animated_cross:925091847905366096> That player has never logged into Hypixel.')
                                    interaction.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false }, ephemeral: true })
                            } else {
                                const error = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription('<a:animated_cross:925091847905366096> An error has occurred.')
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
                                .addField('Overall', 
                                    `\`•\` **Matches**: \`${commaNumber(player.stats.duels.uhc.overall.playedGames)}\`
                                    \`•\` **Best WS**: \`${commaNumber(player.stats.duels.uhc.overall.bestWinstreak)}\`
                                    \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.uhc.overall.winstreak)}\`
                                    \`•\` **Wins**: \`${commaNumber(player.stats.duels.uhc.overall.wins)}\`
                                    \`•\` **Losses**: \`${commaNumber(player.stats.duels.uhc.overall.losses)}\`
                                    \`•\` **WLR**: \`${commaNumber(player.stats.duels.uhc.overall.WLRatio)}\`
                                    \`•\` **Kills**: \`${commaNumber(player.stats.duels.uhc.overall.kills)}\`
                                    \`•\` **Deaths**: \`${commaNumber(player.stats.duels.uhc.overall.deaths)}\`
                                    \`•\` **KDR**: \`${commaNumber(player.stats.duels.uhc.overall.KDRatio)}\`
                                    `, 
                                    true)
                                .addField('Solos', 
                                    `\`•\` **Matches**: \`${commaNumber(player.stats.duels.uhc["1v1"].playedGames)}\`
                                    \`•\` **Best WS**: \`${commaNumber(player.stats.duels.uhc["1v1"].bestWinstreak)}\`
                                    \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.uhc["1v1"].winstreak)}\`
                                    \`•\` **Wins**: \`${commaNumber(player.stats.duels.uhc["1v1"].wins)}\`
                                    \`•\` **Losses**: \`${commaNumber(player.stats.duels.uhc["1v1"].losses)}\`
                                    \`•\` **WLR**: \`${commaNumber(player.stats.duels.uhc["1v1"].WLRatio)}\`
                                    \`•\` **Kills**: \`${commaNumber(player.stats.duels.uhc["1v1"].kills)}\`
                                    \`•\` **Deaths**: \`${commaNumber(player.stats.duels.uhc["1v1"].deaths)}\`
                                    \`•\` **KDR**: \`${commaNumber(player.stats.duels.uhc["1v1"].KDRatio)}\`
                                    `, 
                                    true)
                                .addField('Doubles', 
                                    `\`•\` **Matches**: \`${commaNumber(player.stats.duels.uhc["2v2"].playedGames)}\`
                                    \`•\` **Best WS**: \`${commaNumber(player.stats.duels.uhc["2v2"].bestWinstreak)}\`
                                    \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.uhc["2v2"].winstreak)}\`
                                    \`•\` **Wins**: \`${commaNumber(player.stats.duels.uhc["2v2"].wins)}\`
                                    \`•\` **Losses**: \`${commaNumber(player.stats.duels.uhc["2v2"].losses)}\`
                                    \`•\` **WLR**: \`${commaNumber(player.stats.duels.uhc["2v2"].WLRatio)}\`
                                    \`•\` **Kills**: \`${commaNumber(player.stats.duels.uhc["2v2"].kills)}\`
                                    \`•\` **Deaths**: \`${commaNumber(player.stats.duels.uhc["2v2"].deaths)}\`
                                    \`•\` **KDR**: \`${commaNumber(player.stats.duels.uhc["2v2"].KDRatio)}\`
                                    `, 
                                    true)
                                .addField('Fours', 
                                    `\`•\` **Matches**: \`${commaNumber(player.stats.duels.uhc["4v4"].playedGames)}\`
                                    \`•\` **Best WS**: \`${commaNumber(player.stats.duels.uhc["4v4"].bestWinstreak)}\`
                                    \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.uhc["4v4"].winstreak)}\`
                                    \`•\` **Wins**: \`${commaNumber(player.stats.duels.uhc["4v4"].wins)}\`
                                    \`•\` **Losses**: \`${commaNumber(player.stats.duels.uhc["4v4"].losses)}\`
                                    \`•\` **WLR**: \`${commaNumber(player.stats.duels.uhc["4v4"].WLRatio)}\`
                                    \`•\` **Kills**: \`${commaNumber(player.stats.duels.uhc["4v4"].kills)}\`
                                    \`•\` **Deaths**: \`${commaNumber(player.stats.duels.uhc["4v4"].deaths)}\`
                                    \`•\` **KDR**: \`${commaNumber(player.stats.duels.uhc["4v4"].KDRatio)}\`
                                    `, 
                                    true)
                                .addField('Fours', 
                                    `\`•\` **Matches**: \`${commaNumber(player.stats.duels.uhc.meetup.playedGames)}\`
                                    \`•\` **Best WS**: \`${commaNumber(player.stats.duels.uhc.meetup.bestWinstreak)}\`
                                    \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.uhc.meetup.winstreak)}\`
                                    \`•\` **Wins**: \`${commaNumber(player.stats.duels.uhc.meetup.wins)}\`
                                    \`•\` **Losses**: \`${commaNumber(player.stats.duels.uhc.meetup.losses)}\`
                                    \`•\` **WLR**: \`${commaNumber(player.stats.duels.uhc.meetup.WLRatio)}\`
                                    \`•\` **Kills**: \`${commaNumber(player.stats.duels.uhc.meetup.kills)}\`
                                    \`•\` **Deaths**: \`${commaNumber(player.stats.duels.uhc.meetup.deaths)}\`
                                    \`•\` **KDR**: \`${commaNumber(player.stats.duels.uhc.meetup.KDRatio)}\`
                                    `, 
                                    true)
                                .addField(` ​`, ` ​`, true)

                            interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                        }).catch(e => {
                            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                                const player404 = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription('<a:animated_cross:925091847905366096> I could not find that player in the API. Check spelling and name history.')
                                    interaction.reply({ embeds: [player404], allowedMentions: { repliedUser: false }, ephemeral: true })
                            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                                const neverLogged = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription('<a:animated_cross:925091847905366096> That player has never logged into Hypixel.')
                                    interaction.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false }, ephemeral: true })
                            } else {
                                const error = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`<a:animated_cross:925091847905366096> An error has occurred.`)
                                    interaction.reply({embeds: [error], allowedMentions: { repliedUser: false }, ephemeral: true })
                            }       
                        });
                        break;
                }

        }
    }
}