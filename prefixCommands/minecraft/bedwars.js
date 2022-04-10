const { Message, MessageEmbed, Client, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { hypixel, errors } = require('../../structures/hypixel');
const commaNumber = require('comma-number');
const fetch = require("node-fetch-commonjs")
const { minecraft_embed_colour } = require("../../structures/config.json");
const DB = require("../../structures/schemas/hypixelStatsInteractionDB");
const linkDB = require("../../structures/schemas/hypixelLinkingDB");

module.exports = {
  name: "bedwars",
  aliases: ["bedwar", "bw"],
  description: "Get the bedwars stats of a player.",
  cooldown: 5,
  botCommandChannelOnly: true,
  ownerOnly: false,
  botOwnerOnly: false,
  roles: [],
  whitelist: [],
  /**
   * @param {Message} message 
   * @param {Client} client 
   */
  async execute(message, args, commandName, Prefix, client) {
    function errorHandling (e) {
        console.log(e)
        if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} I could not find that player in the API. Check spelling and name history.`)], allowedMentions: { repliedUser: false }, ephemeral: true })
        } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} That player has never logged into Hypixel.`)], allowedMentions: { repliedUser: false }, ephemeral: true })
        } else { 
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} An error has occurred.`)], allowedMentions: { repliedUser: false }, ephemeral: true })
        }   
    }

    const data = await linkDB.findOne({id: message.member.id});
    var player = args[0]

    if(data && !player) {
        player = data.uuid
    } else if (player) {
        player = player
    } else {
        return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You did not provide a valid player or you haven't linked your account. \n\n If you would like to like your account, use /hypixel link`)]})
    }

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
            .addField("Averages per game", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.avg.kills)}\`\n\`•\` **Final Kills**: \`${commaNumber(player.stats.bedwars.avg.finalKills)}\`\n\`•\` **Beds Broken**: \`${commaNumber(player.stats.bedwars.avg.bedsBroken)}\``, true)
            .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.WLRatio))} WLR**: \`${commaNumber((player.stats.bedwars.losses*Math.ceil(player.stats.bedwars.WLRatio))-player.stats.bedwars.wins)}\`\n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.KDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.deaths*Math.ceil(player.stats.bedwars.KDRatio))-player.stats.bedwars.kills)}\`\n\`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.finalKDRatio))} FKDR**: \`${commaNumber((player.stats.bedwars.finalDeaths*Math.ceil(player.stats.bedwars.finalKDRatio))-player.stats.bedwars.finalKills)}\`\n\`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.beds.BLRatio))} BBLR**: \`${commaNumber((player.stats.bedwars.beds.lost*Math.ceil(player.stats.bedwars.beds.BLRatio))-player.stats.bedwars.beds.broken)}\``, true)
            .addField("Resources collected (All modes)", `\`•\` **Iron**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.iron)}\`\n\`•\` **Gold**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.gold)}\`\n\`•\` **Diamond**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.diamond)}\`\n\`•\` **Emerald**: \`${commaNumber(player.stats.bedwars.collectedItemsTotal.emerald)}\``, true)
        
        const bedwarsRow = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("bedwars-stats")
                .setPlaceholder("Use this menu to select different modes.")
                .addOptions([{ label: "Overall", value: "bedwars-overall" }, { label: "Solos", value: "bedwars-solos" }, { label: "Doubles", value: "bedwars-doubles" }, { label: "Threes", value: "bedwars-threes" }, { label: "Fours", value: "bedwars-fours" }, { label: "4v4", value: "bedwars-4v4" }, { label: "Ultimate Doubles", value: "bedwars-dream-ultimate-doubles" }, { label: "Ultimate Fours", value: "bedwars-dream-ultimate-fours" }, { label: "Rush Doubles", value: "bedwars-dream-rush-doubles" }, { label: "Rush Fours", value: "bedwars-dream-rush-fours" }, { label: "Armed Doubles", value: "bedwars-dream-armed-doubles" }, { label: "Armed Fours", value: "bedwars-dream-armed-fours" }, { label: "Lucky Doubles", value: "bedwars-dream-lucky-doubles" }, { label: "Lucky Fours", value: "bedwars-dream-lucky-fours" }, { label: "Voidless Doubles", value: "bedwars-dream-voidless-doubles" }, { label: "Voidless Fours", value: "bedwars-dream-voidless-fours" }])
        )

        const M = await message.reply({embeds: [bedwarsOverall], components: [bedwarsRow], allowedMentions: {repliedUser: false}});

        await DB.create({GuildID: message.guildId, MessageID: M.id, Player: player, TypeOfStats: "bedwars", InteractionMemberID: message.member.id})

        setTimeout(async () => {
            await M.edit({components: []}).catch((e) => {console.log(e)})
            await DB.deleteOne({GuildID: message.guildId, MessageID: M.id, Player: player, TypeOfStats: "bedwars", InteractionMemberID: message.member.id})
        }, 60 * 1000)

    }).catch(e => {return errorHandling(e)});
  },
};
