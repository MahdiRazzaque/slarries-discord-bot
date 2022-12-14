const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const fetch = require("node-fetch-commonjs")
const { fun_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "yo-mamma",
  description: "Send a yo mamma joke.",
  usage: "/yo-mamma",
  disabled: false,
  botCommandChannelOnly: true,
  options: [
    {
        name: "dm",
        description: "Choose whether to DM the user or send the joke to this channel.",
        type: "BOOLEAN",
        required: true
    },
    {
        name: "target",
        description: "Mention your target.",
        type: "USER",
        required: false
    }
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {

    const dm = interaction.options.getBoolean("dm");
    const target = interaction.options.getUser("target");
        
    const response = await fetch("https://api.yomomma.info/")
    const data = await response.json()

    switch(dm) {
        case true:
            try {
                await target.send({ embeds: [new MessageEmbed().setColor(fun_embed_colour).setDescription(`**${data.joke}**`).setFooter({ text: `Sent by ${interaction.user.tag}`})]})
                return interaction.reply({embeds: [client.successEmbed("The Yo Mamma joke was successfully sent.").addFields({ name: "Joke", value: data.joke})]})
            } catch (error) {
                return interaction.reply({embeds: [client.errorEmbed(`Could not send a DM to ${target}`).addFields({ name: "Joke", value: data.joke})]})
            }
        break;

        case false:
            if(target)
                return interaction.reply({ embeds: [new MessageEmbed().setColor(fun_embed_colour).setDescription(`**${data.joke}**`).setFooter({ text: `Sent by ${interaction.user.tag}`})], content: `${target}`})

            return interaction.reply({ embeds: [new MessageEmbed().setColor(fun_embed_colour).setDescription(`**${data.joke}**`)]})
        break;
    }
  },
};
