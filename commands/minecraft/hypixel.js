const { CommandInteraction, MessageEmbed, Client, Message } = require("discord.js");
const { hypixel, errors } = require('../../structures/hypixel');
const commaNumber = require('comma-number');
const { pagination } = require("reconlx");
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
                hypixel.getPlayer(player).then(async(player) => {
                    const bedwarsOverall = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Overall Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.losses*Math.ceil(player.stats.bedwars.WLRatio))-player.stats.bedwars.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.deaths*Math.ceil(player.stats.bedwars.KDRatio))-player.stats.bedwars.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.finalDeaths*Math.ceil(player.stats.bedwars.finalKDRatio))-player.stats.bedwars.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.beds.lost*Math.ceil(player.stats.bedwars.beds.BLRatio))-player.stats.bedwars.beds.broken)}\`
                            `, true)
                        .addField("Resources collected (All modes)",
                            `\`•\` **Iron**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.iron)}\`
                            \`•\` **Gold**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.gold)}\`
                            \`•\` **Diamond**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.diamond)}\`
                            \`•\` **Emerald**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.emerald)}\`
                            `, true)


                    const bedwarsSolos = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Solo Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.solo.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.solo.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.solo.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.solo.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.solo.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.solo.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.solo.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.solo.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.solo.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.solo.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.solo.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.solo.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.solo.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.solo.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.solo.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.solo.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.solo.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.solo.losses*Math.ceil(player.stats.bedwars.solo.WLRatio))-player.stats.bedwars.solo.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.solo.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.solo.deaths*Math.ceil(player.stats.bedwars.solo.KDRatio))-player.stats.bedwars.solo.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.solo.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.solo.finalDeaths*Math.ceil(player.stats.bedwars.solo.finalKDRatio))-player.stats.bedwars.solo.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.solo.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.solo.beds.lost*Math.ceil(player.stats.bedwars.solo.beds.BLRatio))-player.stats.bedwars.solo.beds.broken)}\`
                            `, true)

                    const bedwarsDoubles = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Doubles Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.doubles.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.doubles.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.doubles.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.doubles.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.doubles.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.doubles.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.doubles.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.doubles.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.doubles.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.doubles.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.doubles.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.doubles.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.doubles.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.doubles.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.doubles.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.doubles.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.doubles.losses*Math.ceil(player.stats.bedwars.doubles.WLRatio))-player.stats.bedwars.doubles.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.doubles.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.doubles.deaths*Math.ceil(player.stats.bedwars.doubles.KDRatio))-player.stats.bedwars.doubles.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.doubles.finalDeaths*Math.ceil(player.stats.bedwars.doubles.finalKDRatio))-player.stats.bedwars.doubles.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.doubles.beds.lost*Math.ceil(player.stats.bedwars.doubles.beds.BLRatio))-player.stats.bedwars.doubles.beds.broken)}\`
                            `, true)

                    const bedwarsThrees = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Threes Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.threes.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.threes.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.threes.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.threes.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.threes.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.threes.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.threes.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.threes.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.threes.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.threes.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.threes.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.threes.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.threes.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.threes.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.threes.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.threes.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.threes.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.threes.losses*Math.ceil(player.stats.bedwars.threes.WLRatio))-player.stats.bedwars.threes.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.threes.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.threes.deaths*Math.ceil(player.stats.bedwars.threes.KDRatio))-player.stats.bedwars.threes.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.threes.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.threes.finalDeaths*Math.ceil(player.stats.bedwars.threes.finalKDRatio))-player.stats.bedwars.threes.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.threes.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.threes.beds.lost*Math.ceil(player.stats.bedwars.threes.beds.BLRatio))-player.stats.bedwars.threes.beds.broken)}\`
                            `, true)

                    const bedwarsFours = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Fours Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.fours.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.fours.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.fours.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.fours.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.fours.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.fours.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.fours.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.fours.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.fours.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.fours.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.fours.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.fours.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.fours.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.fours.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.fours.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.fours.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.fours.losses*Math.ceil(player.stats.bedwars.fours.WLRatio))-player.stats.bedwars.fours.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.fours.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.fours.deaths*Math.ceil(player.stats.bedwars.fours.KDRatio))-player.stats.bedwars.fours.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.fours.finalDeaths*Math.ceil(player.stats.bedwars.fours.finalKDRatio))-player.stats.bedwars.fours.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.fours.beds.lost*Math.ceil(player.stats.bedwars.fours.beds.BLRatio))-player.stats.bedwars.fours.beds.broken)}\`
                            `, true)

                    const bedwarsFourVFour = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: '4v4 Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars["4v4"].winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars["4v4"].wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars["4v4"].losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars["4v4"].WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars["4v4"].kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars["4v4"].deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars["4v4"].KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars["4v4"].finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars["4v4"].finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars["4v4"].finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars["4v4"].beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars["4v4"].beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars["4v4"].beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars["4v4"].avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars["4v4"].avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars["4v4"].avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars["4v4"].WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars["4v4"].losses*Math.ceil(player.stats.bedwars["4v4"].WLRatio))-player.stats.bedwars["4v4"].wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars["4v4"].KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars["4v4"].deaths*Math.ceil(player.stats.bedwars["4v4"].KDRatio))-player.stats.bedwars["4v4"].kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars["4v4"].finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars["4v4"].finalDeaths*Math.ceil(player.stats.bedwars["4v4"].finalKDRatio))-player.stats.bedwars["4v4"].finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars["4v4"].beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars["4v4"].beds.lost*Math.ceil(player.stats.bedwars["4v4"].beds.BLRatio))-player.stats.bedwars["4v4"].beds.broken)}\`
                            `, true)

                    const bedwarsCastle = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Castle Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.castle.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.castle.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.castle.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.castle.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.castle.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.castle.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.castle.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.castle.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.castle.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.castle.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.castle.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.castle.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.castle.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.castle.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.castle.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.castle.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.castle.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.castle.losses*Math.ceil(player.stats.bedwars.castle.WLRatio))-player.stats.bedwars.castle.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.castle.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.castle.deaths*Math.ceil(player.stats.bedwars.castle.KDRatio))-player.stats.bedwars.castle.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.castle.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.castle.finalDeaths*Math.ceil(player.stats.bedwars.castle.finalKDRatio))-player.stats.bedwars.castle.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.castle.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.castle.beds.lost*Math.ceil(player.stats.bedwars.castle.beds.BLRatio))-player.stats.bedwars.castle.beds.broken)}\`
                            `, true)
                        
                    const bedwarsDreamUltimateDoubles = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Ultimate Doubles Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.doubles.losses*Math.ceil(player.stats.bedwars.dream.ultimate.doubles.WLRatio))-player.stats.bedwars.dream.ultimate.doubles.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.doubles.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.doubles.deaths*Math.ceil(player.stats.bedwars.dream.ultimate.doubles.KDRatio))-player.stats.bedwars.dream.ultimate.doubles.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.doubles.finalDeaths*Math.ceil(player.stats.bedwars.dream.ultimate.doubles.finalKDRatio))-player.stats.bedwars.dream.ultimate.doubles.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.doubles.beds.lost*Math.ceil(player.stats.bedwars.dream.ultimate.doubles.beds.BLRatio))-player.stats.bedwars.dream.ultimate.doubles.beds.broken)}\`
                            `, true)

                    const bedwarsDreamUltimateFours = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Ultimate Fours Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.fours.losses*Math.ceil(player.stats.bedwars.dream.ultimate.fours.WLRatio))-player.stats.bedwars.dream.ultimate.fours.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.fours.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.fours.deaths*Math.ceil(player.stats.bedwars.dream.ultimate.fours.KDRatio))-player.stats.bedwars.dream.ultimate.fours.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.fours.finalDeaths*Math.ceil(player.stats.bedwars.dream.ultimate.fours.finalKDRatio))-player.stats.bedwars.dream.ultimate.fours.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.fours.beds.lost*Math.ceil(player.stats.bedwars.dream.ultimate.fours.beds.BLRatio))-player.stats.bedwars.dream.ultimate.fours.beds.broken)}\`
                            `, true)

                    const bedwarsDreamRushDoubles = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Rush Doubles Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.rush.doubles.losses*Math.ceil(player.stats.bedwars.dream.rush.doubles.WLRatio))-player.stats.bedwars.dream.rush.doubles.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.doubles.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.rush.doubles.deaths*Math.ceil(player.stats.bedwars.dream.rush.doubles.KDRatio))-player.stats.bedwars.dream.rush.doubles.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.rush.doubles.finalDeaths*Math.ceil(player.stats.bedwars.dream.rush.doubles.finalKDRatio))-player.stats.bedwars.dream.rush.doubles.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.rush.doubles.beds.lost*Math.ceil(player.stats.bedwars.dream.rush.doubles.beds.BLRatio))-player.stats.bedwars.dream.rush.doubles.beds.broken)}\`
                            `, true)
    
                    const bedwarsDreamRushFours = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Rush Fours Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.rush.fours.losses*Math.ceil(player.stats.bedwars.dream.rush.fours.WLRatio))-player.stats.bedwars.dream.rush.fours.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.fours.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.rush.fours.deaths*Math.ceil(player.stats.bedwars.dream.rush.fours.KDRatio))-player.stats.bedwars.dream.rush.fours.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.rush.fours.finalDeaths*Math.ceil(player.stats.bedwars.dream.rush.fours.finalKDRatio))-player.stats.bedwars.dream.rush.fours.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.rush.fours.beds.lost*Math.ceil(player.stats.bedwars.dream.rush.fours.beds.BLRatio))-player.stats.bedwars.dream.rush.fours.beds.broken)}\`
                            `, true)

                    const bedwarsDreamArmedDoubles = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Armed Doubles Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.armed.doubles.losses*Math.ceil(player.stats.bedwars.dream.armed.doubles.WLRatio))-player.stats.bedwars.dream.armed.doubles.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.doubles.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.armed.doubles.deaths*Math.ceil(player.stats.bedwars.dream.armed.doubles.KDRatio))-player.stats.bedwars.dream.armed.doubles.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.armed.doubles.finalDeaths*Math.ceil(player.stats.bedwars.dream.armed.doubles.finalKDRatio))-player.stats.bedwars.dream.armed.doubles.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.armed.doubles.beds.lost*Math.ceil(player.stats.bedwars.dream.armed.doubles.beds.BLRatio))-player.stats.bedwars.dream.armed.doubles.beds.broken)}\`
                            `, true)
        
                    const bedwarsDreamArmedFours = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Armed Fours Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.armed.fours.losses*Math.ceil(player.stats.bedwars.dream.armed.fours.WLRatio))-player.stats.bedwars.dream.armed.fours.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.fours.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.armed.fours.deaths*Math.ceil(player.stats.bedwars.dream.armed.fours.KDRatio))-player.stats.bedwars.dream.armed.fours.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.armed.fours.finalDeaths*Math.ceil(player.stats.bedwars.dream.armed.fours.finalKDRatio))-player.stats.bedwars.dream.armed.fours.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.armed.fours.beds.lost*Math.ceil(player.stats.bedwars.dream.armed.fours.beds.BLRatio))-player.stats.bedwars.dream.armed.fours.beds.broken)}\`
                            `, true)

                    const bedwarsDreamLuckyDoubles = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Lucky Doubles Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.lucky.doubles.losses*Math.ceil(player.stats.bedwars.dream.lucky.doubles.WLRatio))-player.stats.bedwars.dream.lucky.doubles.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.doubles.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.lucky.doubles.deaths*Math.ceil(player.stats.bedwars.dream.lucky.doubles.KDRatio))-player.stats.bedwars.dream.lucky.doubles.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.lucky.doubles.finalDeaths*Math.ceil(player.stats.bedwars.dream.lucky.doubles.finalKDRatio))-player.stats.bedwars.dream.lucky.doubles.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.lucky.doubles.beds.lost*Math.ceil(player.stats.bedwars.dream.lucky.doubles.beds.BLRatio))-player.stats.bedwars.dream.lucky.doubles.beds.broken)}\`
                            `, true)
            
                    const bedwarsDreamLuckyFours = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Lucky Fours Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.lucky.fours.losses*Math.ceil(player.stats.bedwars.dream.lucky.fours.WLRatio))-player.stats.bedwars.dream.lucky.fours.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.fours.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.lucky.fours.deaths*Math.ceil(player.stats.bedwars.dream.lucky.fours.KDRatio))-player.stats.bedwars.dream.lucky.fours.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.lucky.fours.finalDeaths*Math.ceil(player.stats.bedwars.dream.lucky.fours.finalKDRatio))-player.stats.bedwars.dream.lucky.fours.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.lucky.fours.beds.lost*Math.ceil(player.stats.bedwars.dream.lucky.fours.beds.BLRatio))-player.stats.bedwars.dream.lucky.fours.beds.broken)}\`
                            `, true)

                    const bedwarsDreamVoidlessDoubles = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Voidless Doubles Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.voidless.doubles.losses*Math.ceil(player.stats.bedwars.dream.voidless.doubles.WLRatio))-player.stats.bedwars.dream.voidless.doubles.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.doubles.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.voidless.doubles.deaths*Math.ceil(player.stats.bedwars.dream.voidless.doubles.KDRatio))-player.stats.bedwars.dream.voidless.doubles.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.voidless.doubles.finalDeaths*Math.ceil(player.stats.bedwars.dream.voidless.doubles.finalKDRatio))-player.stats.bedwars.dream.voidless.doubles.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.voidless.doubles.beds.lost*Math.ceil(player.stats.bedwars.dream.voidless.doubles.beds.BLRatio))-player.stats.bedwars.dream.voidless.doubles.beds.broken)}\`
                            `, true)
            
                    const bedwarsDreamVoidlessFours = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: 'Voidless Fours Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats",
                            `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\`
                            \`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\`
                            \`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\`
                            `, true)
                        .addField("Games",
                            `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.winstreak)}\`
                            \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.wins)}\`
                            \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.losses)}\`
                            \`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.WLRatio)}\`
                            `, true)
                        .addField("Combat",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.kills)}\`
                            \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.deaths)}\`
                            \`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.voidless.KDRatio)}\`
                            `, true)
                        .addField("Finals",
                            `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.finalKills)}\`
                            \`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.finalDeaths)}\`
                            \`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.finalKDRatio)}\`
                            `, true)
                        .addField("Beds",
                            `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.beds.broken)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.beds.lost)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.beds.BLRatio)}\`
                            `, true)
                        .addField("Averages per game",
                            `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.avg.kills)}\`
                            \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.avg.finalKills)}\`
                            \`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.avg.bedsBroken)}\`
                            `, true)
                        .addField("Milestones",
                            `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.voidless.fours.losses*Math.ceil(player.stats.bedwars.dream.voidless.fours.WLRatio))-player.stats.bedwars.dream.voidless.fours.wins)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.fours.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.voidless.fours.deaths*Math.ceil(player.stats.bedwars.dream.voidless.fours.KDRatio))-player.stats.bedwars.dream.voidless.fours.kills)}\`
                            \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.voidless.fours.finalDeaths*Math.ceil(player.stats.bedwars.dream.voidless.fours.finalKDRatio))-player.stats.bedwars.dream.voidless.fours.finalKills)}\`
                            \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.voidless.fours.beds.lost*Math.ceil(player.stats.bedwars.dream.voidless.fours.beds.BLRatio))-player.stats.bedwars.dream.voidless.fours.beds.broken)}\`
                            `, true)

                    await interaction.reply({ embeds: [new MessageEmbed().setColor(minecraft_embed_colour).setDescription(`<a:animated_tick:925091839030231071> Here are ${player}'s bedwars stats.`).setFooter({text: "The buttons will expire in 60 seconds."})], allowedMentions: { repliedUser: false } })   
                    
                    const bedwarsEmbeds = [bedwarsOverall, bedwarsSolos, bedwarsDoubles, bedwarsThrees, bedwarsFours, bedwarsFourVFour, bedwarsCastle, bedwarsDreamUltimateDoubles, bedwarsDreamUltimateFours, bedwarsDreamRushDoubles, bedwarsDreamRushFours, bedwarsDreamArmedDoubles, bedwarsDreamArmedFours, bedwarsDreamLuckyDoubles, bedwarsDreamLuckyFours, bedwarsDreamVoidlessDoubles, bedwarsDreamVoidlessFours];

                    pagination({
                        embeds: bedwarsEmbeds,
                        author: interaction.member,
                        channel: interaction.channel,
                        time: "60000",
                        fastSkip: true,
                    })

                }).catch(e => {
                    console.log(e)
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