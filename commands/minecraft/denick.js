const {Client, CommandInteraction, MessageEmbed} = require("discord.js");
const fetch = require("node-fetch-commonjs")
const { minecraft_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "denick",
  description: "Find the real ign of a nick.",
  usage: "/denick",
  disabled: false,
  options: [
    {
      name: "nick",
      description: "The nick of the player your trying to denick.",
      type: "STRING",
      required: true,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {    
    const nick = interaction.options.getString("nick");

    const response = await fetch("https://api.antisniper.net/denick?key=3f21ec77-f262-4974-bbef-3dfbbf7fd462&nick=" + nick)
    const data = await response.json()

    if(!data.success)
        return interaction.reply({embeds: [client.errorEmbed("Something went wrong!")]})

    if(!data.player.nick_in_pool)
        return interaction.reply({embeds: [client.errorEmbed("No data was found for this nick!")]})

    if(!data.player.latest_nick)
        return interaction.reply({embeds: [client.errorEmbed("This person is not nicked!")]})

    const denickEmbed = new MessageEmbed()
        .setColor(minecraft_embed_colour)
        .setTitle("Denicker - " + nick)
        .setThumbnail(`https://crafatar.com/avatars/${data.player.uuid}?overlay&size=256`)
        .addField("Information", 
            `\`•\` **IGN**: \`${data.player.ign}\`` + `\n` +
            `\`•\` **Latest nick**: \`${data.player.latest_nick}\``
            , false)
        .addField("Times", 
            `\`•\` **First detected**: <t:${data.player.first_detected}:f>` + `\n` +
            `\`•\` **Last seen**: <t:${data.player.last_seen}:f>`
            , false)

    return interaction.reply({embeds: [denickEmbed]})

  },
};