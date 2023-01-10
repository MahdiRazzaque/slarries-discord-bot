const { Message, MessageEmbed, Client, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { hypixel, errors } = require('../../structures/hypixel');
const commaNumber = require('comma-number');
const fetch = require("node-fetch-commonjs")
const { minecraft_embed_colour } = require("../../structures/config.json");
const DB = require("../../structures/schemas/hypixelStatsInteractionDB");
const linkDB = require("../../structures/schemas/hypixelLinkingDB");

module.exports = {
  name: "bridge",
  aliases: ["b"],
  description: "Get the bridge stats of a player.",
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
            return message.noMentionReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} I could not find that player in the API. Check spelling and name history.`)], ephemeral: true })
        } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
            return message.noMentionReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} That player has never logged into Hypixel.`)], ephemeral: true })
        } else { 
            return message.noMentionReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} An error has occurred.`)], ephemeral: true })
        }   
    }

    const data = await linkDB.findOne({id: message.author.id});
    var player = args[0]

    if(data && !player) {
        player = data.uuid
    } else if (player) {
        player = player
    } else {
        return message.noMentionReply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You did not provide a valid player or you haven't linked your account. \n\n If you would like to like your account, use /hypixel link`)]})
    }

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
        
        if(message.guild) {
            const M = await message.noMentionReply({embeds: [bridgeOverall], components: [bridgeRow]})

            await DB.create({GuildID: message.guildId, ChannelID: message.channel.id, MessageID: M.id, Player: player, TypeOfStats: "bridge", InteractionMemberID: message.author.id, DateOpened: Date.now()})
    
            setTimeout(async () => {
                await M.edit({components: []}).catch(() => {})
                await DB.deleteOne({GuildID: message.guildId, MessageID: M.id, Player: player, TypeOfStats: "bridge", InteractionMemberID: message.author.id})
            }, 60 * 1000)
        } else {
            await message.noMentionReply({embeds: [bridgeOverall.setFooter({text: "To see other mode stats, please use this command inside a server."})]})
        }
      
    }).catch(e => {return errorHandling(e)});

  },
};
