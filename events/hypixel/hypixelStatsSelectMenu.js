const { Client, MessageEmbed, Message, CommandInteraction } = require("discord.js");
const DB = require("../../structures/schemas/hypixelStatsInteractionDB")
const { hypixel, errors } = require('../../structures/hypixel');
const commaNumber = require('comma-number');
const { minecraft_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "interactionCreate",
  disabled: false,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  execute(interaction, client) {

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

    if(!interaction.isSelectMenu()) return;
    
    if
    (!["bedwars-overall", "bedwars-solos", "bedwars-doubles", "bedwars-threes", "bedwars-fours", "bedwars-4v4", "bedwars-dream-ultimate-doubles", "bedwars-dream-ultimate-fours", "bedwars-dream-rush-doubles", "bedwars-dream-rush-fours", "bedwars-dream-armed-doubles", "bedwars-dream-armed-fours", "bedwars-dream-lucky-doubles", "bedwars-dream-lucky-fours", "bedwars-dream-voidless-doubles", "bedwars-dream-voidless-fours"].includes(interaction.values[0]) && 
    (!["bridge-overall", "bridge-1v1", "bridge-2v2", "bridge-3v3", "bridge-4v4", "bridge-2v2v2v2", "bridge-3v3v3v3", "bridge-ctf"].includes(interaction.values[0]))) 
    return;

    DB.findOne({GuildID: interaction.guild.id, MessageID: interaction.message.id}, async(err, data) => {
        if(err) throw err;
        if(!data) return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("No content was found in the database! ❌")], ephemeral: true})

        const Embed = interaction.message.embeds[0];

        const player = data.Player
        if(!Embed) return;

        switch (data.TypeOfStats) {
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
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.losses*Math.ceil(player.stats.bedwars.WLRatio))-player.stats.bedwars.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.deaths*Math.ceil(player.stats.bedwars.KDRatio))-player.stats.bedwars.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.finalDeaths*Math.ceil(player.stats.bedwars.finalKDRatio))-player.stats.bedwars.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.beds.lost*Math.ceil(player.stats.bedwars.beds.BLRatio))-player.stats.bedwars.beds.broken)}\` `, true)
                        .addField("Resources collected (All modes)", `\`•\` **Iron**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.iron)}\` \n\`•\` **Gold**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.gold)}\` \n\`•\` **Diamond**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.diamond)}\` \n\`•\` **Emerald**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.emerald)}\` `, true)
        
                    const bedwarsSolos = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Solo Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true) .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.solo.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.solo.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.solo.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.solo.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.solo.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.solo.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.solo.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.solo.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.solo.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.solo.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.solo.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.solo.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.solo.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.solo.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.solo.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.solo.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.solo.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.solo.losses*Math.ceil(player.stats.bedwars.solo.WLRatio))-player.stats.bedwars.solo.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.solo.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.solo.deaths*Math.ceil(player.stats.bedwars.solo.KDRatio))-player.stats.bedwars.solo.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.solo.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.solo.finalDeaths*Math.ceil(player.stats.bedwars.solo.finalKDRatio))-player.stats.bedwars.solo.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.solo.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.solo.beds.lost*Math.ceil(player.stats.bedwars.solo.beds.BLRatio))-player.stats.bedwars.solo.beds.broken)}\` `, true)
        
                    const bedwarsDoubles = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Doubles Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.doubles.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.doubles.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.doubles.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.doubles.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.doubles.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.doubles.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.doubles.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.doubles.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.doubles.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.doubles.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.doubles.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.doubles.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.doubles.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.doubles.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.doubles.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.doubles.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.doubles.losses*Math.ceil(player.stats.bedwars.doubles.WLRatio))-player.stats.bedwars.doubles.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.doubles.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.doubles.deaths*Math.ceil(player.stats.bedwars.doubles.KDRatio))-player.stats.bedwars.doubles.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.doubles.finalDeaths*Math.ceil(player.stats.bedwars.doubles.finalKDRatio))-player.stats.bedwars.doubles.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.doubles.beds.lost*Math.ceil(player.stats.bedwars.doubles.beds.BLRatio))-player.stats.bedwars.doubles.beds.broken)}\` `, true)
        
                    const bedwarsThrees = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Threes Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.threes.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.threes.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.threes.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.threes.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.threes.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.threes.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.threes.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.threes.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.threes.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.threes.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.threes.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.threes.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.threes.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.threes.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.threes.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.threes.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.threes.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.threes.losses*Math.ceil(player.stats.bedwars.threes.WLRatio))-player.stats.bedwars.threes.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.threes.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.threes.deaths*Math.ceil(player.stats.bedwars.threes.KDRatio))-player.stats.bedwars.threes.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.threes.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.threes.finalDeaths*Math.ceil(player.stats.bedwars.threes.finalKDRatio))-player.stats.bedwars.threes.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.threes.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.threes.beds.lost*Math.ceil(player.stats.bedwars.threes.beds.BLRatio))-player.stats.bedwars.threes.beds.broken)}\` `, true)
        
                    const bedwarsFours = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Fours Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.fours.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.fours.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.fours.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.fours.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.fours.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.fours.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.fours.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.fours.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.fours.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.fours.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.fours.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.fours.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.fours.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.fours.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.fours.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.fours.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.fours.losses*Math.ceil(player.stats.bedwars.fours.WLRatio))-player.stats.bedwars.fours.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.fours.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.fours.deaths*Math.ceil(player.stats.bedwars.fours.KDRatio))-player.stats.bedwars.fours.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.fours.finalDeaths*Math.ceil(player.stats.bedwars.fours.finalKDRatio))-player.stats.bedwars.fours.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.fours.beds.lost*Math.ceil(player.stats.bedwars.fours.beds.BLRatio))-player.stats.bedwars.fours.beds.broken)}\` `, true)
        
                    const bedwarsFourVFour = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: '4v4 Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars["4v4"].winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars["4v4"].wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars["4v4"].losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars["4v4"].WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars["4v4"].kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars["4v4"].deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars["4v4"].KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars["4v4"].finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars["4v4"].finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars["4v4"].finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars["4v4"].beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars["4v4"].beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars["4v4"].beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars["4v4"].avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars["4v4"].avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars["4v4"].avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars["4v4"].WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars["4v4"].losses*Math.ceil(player.stats.bedwars["4v4"].WLRatio))-player.stats.bedwars["4v4"].wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars["4v4"].KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars["4v4"].deaths*Math.ceil(player.stats.bedwars["4v4"].KDRatio))-player.stats.bedwars["4v4"].kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars["4v4"].finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars["4v4"].finalDeaths*Math.ceil(player.stats.bedwars["4v4"].finalKDRatio))-player.stats.bedwars["4v4"].finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars["4v4"].beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars["4v4"].beds.lost*Math.ceil(player.stats.bedwars["4v4"].beds.BLRatio))-player.stats.bedwars["4v4"].beds.broken)}\` `, true)
        
                    const bedwarsCastle = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Castle Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.castle.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.castle.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.castle.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.castle.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.castle.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.castle.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.castle.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.castle.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.castle.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.castle.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.castle.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.castle.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.castle.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.castle.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.castle.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.castle.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.castle.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.castle.losses*Math.ceil(player.stats.bedwars.castle.WLRatio))-player.stats.bedwars.castle.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.castle.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.castle.deaths*Math.ceil(player.stats.bedwars.castle.KDRatio))-player.stats.bedwars.castle.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.castle.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.castle.finalDeaths*Math.ceil(player.stats.bedwars.castle.finalKDRatio))-player.stats.bedwars.castle.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.castle.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.castle.beds.lost*Math.ceil(player.stats.bedwars.castle.beds.BLRatio))-player.stats.bedwars.castle.beds.broken)}\` `, true)
                        
                    const bedwarsDreamUltimateDoubles = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Ultimate Doubles Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.dream.ultimate.doubles.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.doubles.losses*Math.ceil(player.stats.bedwars.dream.ultimate.doubles.WLRatio))-player.stats.bedwars.dream.ultimate.doubles.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.doubles.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.doubles.deaths*Math.ceil(player.stats.bedwars.dream.ultimate.doubles.KDRatio))-player.stats.bedwars.dream.ultimate.doubles.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.doubles.finalDeaths*Math.ceil(player.stats.bedwars.dream.ultimate.doubles.finalKDRatio))-player.stats.bedwars.dream.ultimate.doubles.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.doubles.beds.lost*Math.ceil(player.stats.bedwars.dream.ultimate.doubles.beds.BLRatio))-player.stats.bedwars.dream.ultimate.doubles.beds.broken)}\` `, true)
        
                    const bedwarsDreamUltimateFours = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Ultimate Fours Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.dream.ultimate.fours.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.fours.losses*Math.ceil(player.stats.bedwars.dream.ultimate.fours.WLRatio))-player.stats.bedwars.dream.ultimate.fours.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.fours.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.fours.deaths*Math.ceil(player.stats.bedwars.dream.ultimate.fours.KDRatio))-player.stats.bedwars.dream.ultimate.fours.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.fours.finalDeaths*Math.ceil(player.stats.bedwars.dream.ultimate.fours.finalKDRatio))-player.stats.bedwars.dream.ultimate.fours.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.ultimate.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.ultimate.fours.beds.lost*Math.ceil(player.stats.bedwars.dream.ultimate.fours.beds.BLRatio))-player.stats.bedwars.dream.ultimate.fours.beds.broken)}\` `, true)
        
                    const bedwarsDreamRushDoubles = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Rush Doubles Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.dream.rush.doubles.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.rush.doubles.losses*Math.ceil(player.stats.bedwars.dream.rush.doubles.WLRatio))-player.stats.bedwars.dream.rush.doubles.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.doubles.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.rush.doubles.deaths*Math.ceil(player.stats.bedwars.dream.rush.doubles.KDRatio))-player.stats.bedwars.dream.rush.doubles.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.rush.doubles.finalDeaths*Math.ceil(player.stats.bedwars.dream.rush.doubles.finalKDRatio))-player.stats.bedwars.dream.rush.doubles.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.rush.doubles.beds.lost*Math.ceil(player.stats.bedwars.dream.rush.doubles.beds.BLRatio))-player.stats.bedwars.dream.rush.doubles.beds.broken)}\` `, true)
        
                    const bedwarsDreamRushFours = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Rush Fours Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.dream.rush.fours.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.rush.fours.losses*Math.ceil(player.stats.bedwars.dream.rush.fours.WLRatio))-player.stats.bedwars.dream.rush.fours.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.fours.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.rush.fours.deaths*Math.ceil(player.stats.bedwars.dream.rush.fours.KDRatio))-player.stats.bedwars.dream.rush.fours.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.rush.fours.finalDeaths*Math.ceil(player.stats.bedwars.dream.rush.fours.finalKDRatio))-player.stats.bedwars.dream.rush.fours.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.rush.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.rush.fours.beds.lost*Math.ceil(player.stats.bedwars.dream.rush.fours.beds.BLRatio))-player.stats.bedwars.dream.rush.fours.beds.broken)}\` `, true)
        
                    const bedwarsDreamArmedDoubles = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Armed Doubles Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.dream.armed.doubles.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.armed.doubles.losses*Math.ceil(player.stats.bedwars.dream.armed.doubles.WLRatio))-player.stats.bedwars.dream.armed.doubles.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.doubles.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.armed.doubles.deaths*Math.ceil(player.stats.bedwars.dream.armed.doubles.KDRatio))-player.stats.bedwars.dream.armed.doubles.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.armed.doubles.finalDeaths*Math.ceil(player.stats.bedwars.dream.armed.doubles.finalKDRatio))-player.stats.bedwars.dream.armed.doubles.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.armed.doubles.beds.lost*Math.ceil(player.stats.bedwars.dream.armed.doubles.beds.BLRatio))-player.stats.bedwars.dream.armed.doubles.beds.broken)}\` `, true)
        
                    const bedwarsDreamArmedFours = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Armed Fours Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.dream.armed.fours.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.armed.fours.losses*Math.ceil(player.stats.bedwars.dream.armed.fours.WLRatio))-player.stats.bedwars.dream.armed.fours.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.fours.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.armed.fours.deaths*Math.ceil(player.stats.bedwars.dream.armed.fours.KDRatio))-player.stats.bedwars.dream.armed.fours.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.armed.fours.finalDeaths*Math.ceil(player.stats.bedwars.dream.armed.fours.finalKDRatio))-player.stats.bedwars.dream.armed.fours.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.armed.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.armed.fours.beds.lost*Math.ceil(player.stats.bedwars.dream.armed.fours.beds.BLRatio))-player.stats.bedwars.dream.armed.fours.beds.broken)}\` `, true)
        
                    const bedwarsDreamLuckyDoubles = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Lucky Doubles Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.dream.lucky.doubles.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.lucky.doubles.losses*Math.ceil(player.stats.bedwars.dream.lucky.doubles.WLRatio))-player.stats.bedwars.dream.lucky.doubles.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.doubles.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.lucky.doubles.deaths*Math.ceil(player.stats.bedwars.dream.lucky.doubles.KDRatio))-player.stats.bedwars.dream.lucky.doubles.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.lucky.doubles.finalDeaths*Math.ceil(player.stats.bedwars.dream.lucky.doubles.finalKDRatio))-player.stats.bedwars.dream.lucky.doubles.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.lucky.doubles.beds.lost*Math.ceil(player.stats.bedwars.dream.lucky.doubles.beds.BLRatio))-player.stats.bedwars.dream.lucky.doubles.beds.broken)}\` `, true)
            
                    const bedwarsDreamLuckyFours = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Lucky Fours Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.dream.lucky.fours.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.lucky.fours.losses*Math.ceil(player.stats.bedwars.dream.lucky.fours.WLRatio))-player.stats.bedwars.dream.lucky.fours.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.fours.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.lucky.fours.deaths*Math.ceil(player.stats.bedwars.dream.lucky.fours.KDRatio))-player.stats.bedwars.dream.lucky.fours.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.lucky.fours.finalDeaths*Math.ceil(player.stats.bedwars.dream.lucky.fours.finalKDRatio))-player.stats.bedwars.dream.lucky.fours.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.lucky.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.lucky.fours.beds.lost*Math.ceil(player.stats.bedwars.dream.lucky.fours.beds.BLRatio))-player.stats.bedwars.dream.lucky.fours.beds.broken)}\` `, true)
        
                    const bedwarsDreamVoidlessDoubles = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Voidless Doubles Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.dream.voidless.doubles.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.doubles.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.voidless.doubles.losses*Math.ceil(player.stats.bedwars.dream.voidless.doubles.WLRatio))-player.stats.bedwars.dream.voidless.doubles.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.doubles.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.voidless.doubles.deaths*Math.ceil(player.stats.bedwars.dream.voidless.doubles.KDRatio))-player.stats.bedwars.dream.voidless.doubles.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.doubles.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.voidless.doubles.finalDeaths*Math.ceil(player.stats.bedwars.dream.voidless.doubles.finalKDRatio))-player.stats.bedwars.dream.voidless.doubles.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.doubles.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.voidless.doubles.beds.lost*Math.ceil(player.stats.bedwars.dream.voidless.doubles.beds.BLRatio))-player.stats.bedwars.dream.voidless.doubles.beds.broken)}\` `, true)
            
                    const bedwarsDreamVoidlessFours = new MessageEmbed()
                        .setColor(bedwarsEmbedColour)
                        .setAuthor({name: 'Voidless Fours Bedwars Stats', iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.bedwars.prestige} Prestige`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("General Stats", `\`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n\`•\` **Star**: \`[${commaNumber(player.stats.bedwars.level)}✫]\` \n\`•\` **Loot Chests**: \`${commaNumber(player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween + player.stats.bedwars.lootChests.golden || "0")}\` `, true)
                        .addField("Games", `\`•\` **WS**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.winstreak)}\` \n\`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.wins)}\` \n\`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.losses)}\` \n\`•\` **WLR**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.WLRatio)}\` `, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.kills)}\` \n\`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.deaths)}\` \n\`•\` **KDR**: \`${commaNumber(player.stats.bedwars.dream.voidless.KDRatio)}\` `, true)
                        .addField("Finals", `\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.finalKills)}\` \n\`•\` **Final Deaths**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.finalDeaths)}\` \n\`•\` **FKDR**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.finalKDRatio)}\` `, true)
                        .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.beds.broken)}\` \n\`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.beds.lost)}\` \n\`•\` **BBLR**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.beds.BLRatio)}\` `, true)
                        .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.avg.kills)}\` \n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.avg.finalKills)}\` \n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.dream.voidless.fours.avg.bedsBroken)}\` `, true)
                        .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.fours.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.dream.voidless.fours.losses*Math.ceil(player.stats.bedwars.dream.voidless.fours.WLRatio))-player.stats.bedwars.dream.voidless.fours.wins)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.fours.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.voidless.fours.deaths*Math.ceil(player.stats.bedwars.dream.voidless.fours.KDRatio))-player.stats.bedwars.dream.voidless.fours.kills)}\` \n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.fours.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.dream.voidless.fours.finalDeaths*Math.ceil(player.stats.bedwars.dream.voidless.fours.finalKDRatio))-player.stats.bedwars.dream.voidless.fours.finalKills)}\` \n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream.voidless.fours.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.dream.voidless.fours.beds.lost*Math.ceil(player.stats.bedwars.dream.voidless.fours.beds.BLRatio))-player.stats.bedwars.dream.voidless.fours.beds.broken)}\` `, true)
                    
                    const bedwarsEmbeds = [bedwarsOverall, bedwarsSolos, bedwarsDoubles, bedwarsThrees, bedwarsFours, bedwarsFourVFour, bedwarsCastle, bedwarsDreamUltimateDoubles, bedwarsDreamUltimateFours, bedwarsDreamRushDoubles, bedwarsDreamRushFours, bedwarsDreamArmedDoubles, bedwarsDreamArmedFours, bedwarsDreamLuckyDoubles, bedwarsDreamLuckyFours, bedwarsDreamVoidlessDoubles, bedwarsDreamVoidlessFours];
 
                    if (interaction.member.id === data.InteractionMemberID) {
                        switch(interaction.values[0]) {
                            case "bedwars-overall": 
                                interaction.message.edit({embeds: [bedwarsOverall]})
                            break;
                            case "bedwars-solos": 
                                interaction.message.edit({embeds: [bedwarsSolos]})
                            break;
                            case "bedwars-doubles": 
                            interaction.message.edit({embeds: [bedwarsDoubles]})
                            break;
                            case "bedwars-threes": 
                            interaction.message.edit({embeds: [bedwarsThrees]})
                            break;
                            case "bedwars-fours": 
                            interaction.message.edit({embeds: [bedwarsFours]})
                            break;
                            case "bedwars-4v4": 
                            interaction.message.edit({embeds: [bedwarsFourVFour]})
                            break;
                            case "bedwars-dream-ultimate-doubles": 
                            interaction.message.edit({embeds: [bedwarsDreamUltimateDoubles]})
                            break;
                            case "bedwars-dream-ultimate-fours": 
                            interaction.message.edit({embeds: [bedwarsDreamUltimateFours]})
                            break;
                            case "bedwars-dream-rush-doubles": 
                            interaction.message.edit({embeds: [bedwarsDreamRushDoubles]})
                            break;
                            case "bedwars-dream-rush-fours": 
                            interaction.message.edit({embeds: [bedwarsDreamRushFours]})
                            break;
                            case "bedwars-dream-armed-doubles": 
                            interaction.message.edit({embeds: [bedwarsDreamArmedDoubles]})
                            break;
                            case "bedwars-dream-armed-fours": 
                            interaction.message.edit({embeds: [bedwarsDreamArmedFours]})
                            break;
                            case "bedwars-dream-lucky-doubles": 
                            interaction.message.edit({embeds: [bedwarsDreamLuckyDoubles]})
                            break;
                            case "bedwars-dream-lucky-fours": 
                            interaction.message.edit({embeds: [bedwarsDreamLuckyFours]})
                            break;
                            case "bedwars-dream-voidless-doubles": 
                            interaction.message.edit({embeds: [bedwarsDreamVoidlessDoubles]})
                            break;
                            case "bedwars-dream-voidless-fours": 
                            interaction.message.edit({embeds: [bedwarsDreamVoidlessFours]})
                            break;
                        }
                        interaction.deferUpdate()
                    } else {
                        switch(interaction.values[0]) {
                            case "bedwars-overall": 
                                interaction.reply({embeds: [bedwarsOverall], ephemeral: true})
                            break;
                            case "bedwars-solos": 
                                interaction.reply({embeds: [bedwarsSolos], ephemeral: true})
                            break;
                            case "bedwars-doubles": 
                            interaction.reply({embeds: [bedwarsDoubles], ephemeral: true})
                            break;
                            case "bedwars-threes": 
                            interaction.reply({embeds: [bedwarsThrees], ephemeral: true})
                            break;
                            case "bedwars-fours": 
                            interaction.reply({embeds: [bedwarsFours], ephemeral: true})
                            break;
                            case "bedwars-4v4": 
                            interaction.reply({embeds: [bedwarsFourVFour], ephemeral: true})
                            break;
                            case "bedwars-dream-ultimate-doubles": 
                            interaction.reply({embeds: [bedwarsDreamUltimateDoubles], ephemeral: true})
                            break;
                            case "bedwars-dream-ultimate-fours": 
                            interaction.reply({embeds: [bedwarsDreamUltimateFours], ephemeral: true})
                            break;
                            case "bedwars-dream-rush-doubles": 
                            interaction.reply({embeds: [bedwarsDreamRushDoubles], ephemeral: true})
                            break;
                            case "bedwars-dream-rush-fours": 
                            interaction.reply({embeds: [bedwarsDreamRushFours], ephemeral: true})
                            break;
                            case "bedwars-dream-armed-doubles": 
                            interaction.reply({embeds: [bedwarsDreamArmedDoubles], ephemeral: true})
                            break;
                            case "bedwars-dream-armed-fours": 
                            interaction.reply({embeds: [bedwarsDreamArmedFours], ephemeral: true})
                            break;
                            case "bedwars-dream-lucky-doubles": 
                            interaction.reply({embeds: [bedwarsDreamLuckyDoubles], ephemeral: true})
                            break;
                            case "bedwars-dream-lucky-fours": 
                            interaction.reply({embeds: [bedwarsDreamLuckyFours], ephemeral: true})
                            break;
                            case "bedwars-dream-voidless-doubles": 
                            interaction.reply({embeds: [bedwarsDreamVoidlessDoubles], ephemeral: true})
                            break;
                            case "bedwars-dream-voidless-fours": 
                            interaction.reply({embeds: [bedwarsDreamVoidlessFours], ephemeral: true})
                            break;
                        }
                    }

                }).catch(e => {return errorHandling(e)});
            break;
            case "bridge":
                hypixel.getPlayer(player).then(async(player) => {
                    const bridgeOverall = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: `Overall Bridge Stats`, iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.duels.bridge.overall.division}`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("Games", `\`•\` **Best WS**: \`${commaNumber(player.stats.duels.bridge.overall.bestWinstreak)}\`\n \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.bridge.overall.winstreak)}\`\n \`•\` **Wins**: \`${commaNumber(player.stats.duels.bridge.overall.wins)}\`\n \`•\` **Losses**: \`${commaNumber(player.stats.duels.bridge.overall.losses)}\`\n \`•\` **WLR**: \`${commaNumber(player.stats.duels.bridge.overall.WLRatio)}\``, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.duels.bridge.overall.kills)}\`\n \`•\` **Deaths**: \`${commaNumber(player.stats.duels.bridge.overall.deaths)}\`\n \`•\` **KDR**: \`${commaNumber(player.stats.duels.bridge.overall.KDRatio)}\``, true)
                        .addField("Milstones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.duels.bridge.overall.WLRatio))} WLR**: \`${commaNumber((player.stats.duels.bridge.overall.losses*Math.ceil(player.stats.duels.bridge.overall.WLRatio))-player.stats.duels.bridge.overall.wins)}\`\n \`•\` **Kills to ${commaNumber(Math.ceil(player.stats.duels.bridge.overall.KDRatio))} KDR**: \`${commaNumber((player.stats.duels.bridge.overall.deaths*Math.ceil(player.stats.duels.bridge.overall.KDRatio))-player.stats.duels.bridge.overall.kills)}\``, true)
                    
                    const bridge1v1 = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: `1v1 Bridge Stats`, iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.duels.bridge.overall.division}`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("Games", `\`•\` **Best WS**: \`${commaNumber(player.stats.duels.bridge["1v1"].bestWinstreak)}\`\n \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.bridge["1v1"].winstreak)}\`\n \`•\` **Wins**: \`${commaNumber(player.stats.duels.bridge["1v1"].wins)}\`\n \`•\` **Losses**: \`${commaNumber(player.stats.duels.bridge["1v1"].losses)}\`\n \`•\` **WLR**: \`${commaNumber(player.stats.duels.bridge["1v1"].WLRatio)}\``, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.duels.bridge["1v1"].kills)}\`\n \`•\` **Deaths**: \`${commaNumber(player.stats.duels.bridge["1v1"].deaths)}\`\n \`•\` **KDR**: \`${commaNumber(player.stats.duels.bridge["1v1"].KDRatio)}\``, true)
                        .addField("Milstones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.duels.bridge["1v1"].WLRatio))} WLR**: \`${commaNumber((player.stats.duels.bridge["1v1"].losses*Math.ceil(player.stats.duels.bridge["1v1"].WLRatio))-player.stats.duels.bridge["1v1"].wins)}\`\n \`•\` **Kills to ${commaNumber(Math.ceil(player.stats.duels.bridge["1v1"].KDRatio))} KDR**: \`${commaNumber((player.stats.duels.bridge["1v1"].deaths*Math.ceil(player.stats.duels.bridge["1v1"].KDRatio))-player.stats.duels.bridge["1v1"].kills)}\``, true)

                    const bridge2v2 = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: `2v2 Bridge Stats`, iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.duels.bridge.overall.division}`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("Games", `\`•\` **Best WS**: \`${commaNumber(player.stats.duels.bridge["2v2"].bestWinstreak)}\`\n \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.bridge["2v2"].winstreak)}\`\n \`•\` **Wins**: \`${commaNumber(player.stats.duels.bridge["2v2"].wins)}\`\n \`•\` **Losses**: \`${commaNumber(player.stats.duels.bridge["2v2"].losses)}\`\n \`•\` **WLR**: \`${commaNumber(player.stats.duels.bridge["2v2"].WLRatio)}\``, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.duels.bridge["2v2"].kills)}\`\n \`•\` **Deaths**: \`${commaNumber(player.stats.duels.bridge["2v2"].deaths)}\`\n \`•\` **KDR**: \`${commaNumber(player.stats.duels.bridge["2v2"].KDRatio)}\``, true)
                        .addField("Milstones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.duels.bridge["2v2"].WLRatio))} WLR**: \`${commaNumber((player.stats.duels.bridge["2v2"].losses*Math.ceil(player.stats.duels.bridge["2v2"].WLRatio))-player.stats.duels.bridge["2v2"].wins)}\`\n \`•\` **Kills to ${commaNumber(Math.ceil(player.stats.duels.bridge["2v2"].KDRatio))} KDR**: \`${commaNumber((player.stats.duels.bridge["2v2"].deaths*Math.ceil(player.stats.duels.bridge["2v2"].KDRatio))-player.stats.duels.bridge["2v2"].kills)}\``, true)

                    const bridge3v3 = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: `3v3 Bridge Stats`, iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.duels.bridge.overall.division}`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("Games", `\`•\` **Best WS**: \`${commaNumber(player.stats.duels.bridge["3v3"].bestWinstreak)}\`\n \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.bridge["3v3"].winstreak)}\`\n \`•\` **Wins**: \`${commaNumber(player.stats.duels.bridge["3v3"].wins)}\`\n \`•\` **Losses**: \`${commaNumber(player.stats.duels.bridge["3v3"].losses)}\`\n \`•\` **WLR**: \`${commaNumber(player.stats.duels.bridge["3v3"].WLRatio)}\``, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.duels.bridge["3v3"].kills)}\`\n \`•\` **Deaths**: \`${commaNumber(player.stats.duels.bridge["3v3"].deaths)}\`\n \`•\` **KDR**: \`${commaNumber(player.stats.duels.bridge["3v3"].KDRatio)}\``, true)
                        .addField("Milstones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.duels.bridge["3v3"].WLRatio))} WLR**: \`${commaNumber((player.stats.duels.bridge["3v3"].losses*Math.ceil(player.stats.duels.bridge["3v3"].WLRatio))-player.stats.duels.bridge["3v3"].wins)}\`\n \`•\` **Kills to ${commaNumber(Math.ceil(player.stats.duels.bridge["3v3"].KDRatio))} KDR**: \`${commaNumber((player.stats.duels.bridge["3v3"].deaths*Math.ceil(player.stats.duels.bridge["3v3"].KDRatio))-player.stats.duels.bridge["3v3"].kills)}\``, true)
                    
                    const bridge4v4 = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: `4v4 Bridge Stats`, iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.duels.bridge.overall.division}`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("Games", `\`•\` **Best WS**: \`${commaNumber(player.stats.duels.bridge.bestWinstreak)}\`\n \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.bridge["4v4"].winstreak)}\`\n \`•\` **Wins**: \`${commaNumber(player.stats.duels.bridge["4v4"].wins)}\`\n \`•\` **Losses**: \`${commaNumber(player.stats.duels.bridge["4v4"].losses)}\`\n \`•\` **WLR**: \`${commaNumber(player.stats.duels.bridge["4v4"].WLRatio)}\``, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.duels.bridge["4v4"].kills)}\`\n \`•\` **Deaths**: \`${commaNumber(player.stats.duels.bridge["4v4"].deaths)}\`\n \`•\` **KDR**: \`${commaNumber(player.stats.duels.bridge["4v4"].KDRatio)}\``, true)
                        .addField("Milstones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.duels.bridge["4v4"].WLRatio))} WLR**: \`${commaNumber((player.stats.duels.bridge["4v4"].losses*Math.ceil(player.stats.duels.bridge["4v4"].WLRatio))-player.stats.duels.bridge["4v4"].wins)}\`\n \`•\` **Kills to ${commaNumber(Math.ceil(player.stats.duels.bridge["4v4"].KDRatio))} KDR**: \`${commaNumber((player.stats.duels.bridge["4v4"].deaths*Math.ceil(player.stats.duels.bridge["4v4"].KDRatio))-player.stats.duels.bridge["4v4"].kills)}\``, true)

                    const bridge2v2v2v2 = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: `2v2v2v2 Bridge Stats`, iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.duels.bridge.overall.division}`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("Games", `\`•\` **Best WS**: \`${commaNumber(player.stats.duels.bridge.bestWinstreak)}\`\n \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.bridge["2v2v2v2"].winstreak)}\`\n \`•\` **Wins**: \`${commaNumber(player.stats.duels.bridge["2v2v2v2"].wins)}\`\n \`•\` **Losses**: \`${commaNumber(player.stats.duels.bridge["2v2v2v2"].losses)}\`\n \`•\` **WLR**: \`${commaNumber(player.stats.duels.bridge["2v2v2v2"].WLRatio)}\``, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.duels.bridge["2v2v2v2"].kills)}\`\n \`•\` **Deaths**: \`${commaNumber(player.stats.duels.bridge["2v2v2v2"].deaths)}\`\n \`•\` **KDR**: \`${commaNumber(player.stats.duels.bridge["2v2v2v2"].KDRatio)}\``, true)
                        .addField("Milstones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.duels.bridge["2v2v2v2"].WLRatio))} WLR**: \`${commaNumber((player.stats.duels.bridge["2v2v2v2"].losses*Math.ceil(player.stats.duels.bridge["2v2v2v2"].WLRatio))-player.stats.duels.bridge["2v2v2v2"].wins)}\`\n \`•\` **Kills to ${commaNumber(Math.ceil(player.stats.duels.bridge["2v2v2v2"].KDRatio))} KDR**: \`${commaNumber((player.stats.duels.bridge["2v2v2v2"].deaths*Math.ceil(player.stats.duels.bridge["2v2v2v2"].KDRatio))-player.stats.duels.bridge["2v2v2v2"].kills)}\``, true)
                    
                    const bridge3v3v3v3 = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: `3v3v3v3 Bridge Stats`, iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.duels.bridge.overall.division}`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("Games", `\`•\` **Best WS**: \`${commaNumber(player.stats.duels.bridge.bestWinstreak)}\`\n \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.bridge["3v3v3v3"].winstreak)}\`\n \`•\` **Wins**: \`${commaNumber(player.stats.duels.bridge["3v3v3v3"].wins)}\`\n \`•\` **Losses**: \`${commaNumber(player.stats.duels.bridge["3v3v3v3"].losses)}\`\n \`•\` **WLR**: \`${commaNumber(player.stats.duels.bridge["3v3v3v3"].WLRatio)}\``, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.duels.bridge["3v3v3v3"].kills)}\`\n \`•\` **Deaths**: \`${commaNumber(player.stats.duels.bridge["3v3v3v3"].deaths)}\`\n \`•\` **KDR**: \`${commaNumber(player.stats.duels.bridge["3v3v3v3"].KDRatio)}\``, true)
                        .addField("Milstones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.duels.bridge["3v3v3v3"].WLRatio))} WLR**: \`${commaNumber((player.stats.duels.bridge["3v3v3v3"].losses*Math.ceil(player.stats.duels.bridge["3v3v3v3"].WLRatio))-player.stats.duels.bridge["3v3v3v3"].wins)}\`\n \`•\` **Kills to ${commaNumber(Math.ceil(player.stats.duels.bridge["3v3v3v3"].KDRatio))} KDR**: \`${commaNumber((player.stats.duels.bridge["3v3v3v3"].deaths*Math.ceil(player.stats.duels.bridge["3v3v3v3"].KDRatio))-player.stats.duels.bridge["3v3v3v3"].kills)}\``, true)
                    
                    const bridgeCtf = new MessageEmbed()
                        .setColor(minecraft_embed_colour)
                        .setAuthor({name: `CTF Bridge Stats`, iconURL: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png'})
                        .setTitle(`[${player.rank}] ${player.nickname}   |   ${player.stats.duels.bridge.ctf.division}`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField("Games", `\`•\` **Best WS**: \`${commaNumber(player.stats.duels.bridge.ctf.bestWinstreak)}\`\n \`•\` **Winstreak**: \`${commaNumber(player.stats.duels.bridge.ctf.winstreak)}\`\n \`•\` **Wins**: \`${commaNumber(player.stats.duels.bridge.ctf.wins)}\`\n \`•\` **Losses**: \`${commaNumber(player.stats.duels.bridge.ctf.losses)}\`\n \`•\` **WLR**: \`${commaNumber(player.stats.duels.bridge.ctf.WLRatio)}\``, true)
                        .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.duels.bridge.ctf.kills)}\`\n \`•\` **Deaths**: \`${commaNumber(player.stats.duels.bridge.ctf.deaths)}\`\n \`•\` **KDR**: \`${commaNumber(player.stats.duels.bridge.ctf.KDRatio)}\``, true)
                        .addField("Milstones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.duels.bridge.ctf.WLRatio))} WLR**: \`${commaNumber((player.stats.duels.bridge.ctf.losses*Math.ceil(player.stats.duels.bridge.ctf.WLRatio))-player.stats.duels.bridge.ctf.wins)}\`\n \`•\` **Kills to ${commaNumber(Math.ceil(player.stats.duels.bridge.ctf.KDRatio))} KDR**: \`${commaNumber((player.stats.duels.bridge.ctf.deaths*Math.ceil(player.stats.duels.bridge.ctf.KDRatio))-player.stats.duels.bridge.ctf.kills)}\``, true)

                    var colour;
                    if(player.stats.duels.bridge.overall.wins > 50)
                        colour = "GREY"
            
                    if(player.stats.duels.bridge.overall.wins > 100)
                        colour = "LIGHT_GREY"
            
                    if(player.stats.duels.bridge.overall.wins > 250)
                        colour = "GOLD"
            
                    if(player.stats.duels.bridge.overall.wins > 500)
                        colour = "DARK_AQUA"
            
                    if(player.stats.duels.bridge.overall.wins > 1000)
                        colour = "DARK_GREEN"
                    
                    if(player.stats.duels.bridge.overall.wins > 2000)
                        colour = "DARK_RED"
                    
                    if(player.stats.duels.bridge.overall.wins > 5000)
                        colour = "GOLD"
            
                    if(player.stats.duels.bridge.overall.wins > 10000)
                        colour = "DARK_PURPLE"

                    if (interaction.member.id === data.InteractionMemberID) {
                        switch(interaction.values[0]) {
                            case "bridge-overall": 
                                interaction.message.edit({embeds: [bridgeOverall.setColor(colour)]})
                            break;
                            case "bridge-1v1": 
                                interaction.message.edit({embeds: [bridge1v1.setColor(colour).setColor(colour)]})
                            break;
                            case "bridge-2v2": 
                                interaction.message.edit({embeds: [bridge2v2.setColor(colour).setColor(colour)]})
                            break;
                            case "bridge-3v3": 
                                interaction.message.edit({embeds: [bridge3v3.setColor(colour).setColor(colour)]})
                            break;
                            case "bridge-4v4": 
                                interaction.message.edit({embeds: [bridge4v4.setColor(colour)]})
                            break;
                            case "bridge-2v2v2v2": 
                                interaction.message.edit({embeds: [bridge2v2v2v2.setColor(colour)]})
                            break;
                            case "bridge-3v3v3v3": 
                                interaction.message.edit({embeds: [bridge3v3v3v3.setColor(colour)]})
                            break;
                            case "bridge-ctf": 
                                interaction.message.edit({embeds: [bridgeCtf.setColor(colour)]})
                            break;
                        }
                        interaction.deferUpdate()
                    } else {
                        switch(interaction.values[0]) {
                            case "bridge-overall": 
                                interaction.reply({embeds: [bridgeOverall.setColor(colour)], ephemeral: true})
                            break;
                            case "bridge-1v1": 
                                interaction.reply({embeds: [bridge1v1.setColor(colour)], ephemeral: true})
                            break;
                            case "bridge-2v2": 
                                interaction.reply({embeds: [bridge2v2.setColor(colour)], ephemeral: true})
                            break;
                            case "bridge-3v3": 
                                interaction.reply({embeds: [bridge3v3.setColor(colour)], ephemeral: true})
                            break;
                            case "bridge-4v4": 
                                interaction.reply({embeds: [bridge4v4.setColor(colour)], ephemeral: true})
                            break;
                            case "bridge-2v2v2v2": 
                                interaction.reply({embeds: [bridge2v2v2v2.setColor(colour)], ephemeral: true})
                            break;
                            case "bridge-3v3v3v3": 
                                interaction.reply({embeds: [bridge3v3v3v3.setColor(colour)], ephemeral: true})
                            break;
                            case "bridge-ctf": 
                                interaction.reply({embeds: [bridgeCtf.setColor(colour)], ephemeral: true})
                            break;
                        }                    
                    }     
                }).catch(e => {return errorHandling(e)});

            break;
        }


    })
  },
};
