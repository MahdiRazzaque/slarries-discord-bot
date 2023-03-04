const { Message, MessageEmbed, Client } = require("discord.js");
const fetch = require("node-fetch-commonjs")
const { minecraft_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "denick",
  aliases: [],
  description: "Denick a player.",
  usage: "!denick",
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

    const response = await fetch("https://api.antisniper.net/denick?key=3f21ec77-f262-4974-bbef-3dfbbf7fd462&nick=" + args[0])
    const data = await response.json()

    if(!args[0])
        return message.noMentionReply({embeds: [client.errorEmbed("You have to provide at ign!")]})

    if(!data.success)
        return message.noMentionReply({embeds: [client.errorEmbed("Something went wrong!")]})

    if(!data.player.nick_in_pool)
        return message.noMentionReply({embeds: [client.errorEmbed("No data was found for this nick!")]})

    if(!data.player.latest_nick)
        return message.noMentionReply({embeds: [client.errorEmbed("This person is not nicked!")]})

    const denickEmbed = new MessageEmbed()
        .setColor(minecraft_embed_colour)
        .setTitle("Denicker - " + args[0])
        .setThumbnail(`https://crafatar.com/avatars/${data.player.uuid}?overlay&size=256`)
        .addField("Information", 
            `\`•\` **IGN**: \`${data.player.ign}\`` + `\n` +
            `\`•\` **Latest nick**: \`${data.player.latest_nick}\``
            , false)
        .addField("Times", 
            `\`•\` **First detected**: <t:${data.player.first_detected}:f>` + `\n` +
            `\`•\` **Last seen**: <t:${data.player.last_seen}:f>`
            , false)

    return message.noMentionReply({embeds: [denickEmbed]})
  },
};
