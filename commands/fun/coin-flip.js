const { Client, CommandInteraction, MessageEmbed, MessageAttachment } = require("discord.js");
const answers = ["heads", "tails"];
const { fun_embed_colour } = require("../../structures/config.json")

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

module.exports = {
  name: "coin-flip",
  description: "Heads or tails?",
  usage: "/coin-flip",
  disabled: false,
  botCommandChannelOnly: true,
  options: [
    {
      name: "choice",
      required: true,
      description: "Heads or tails?",
      type: "STRING",
      choices: [
        { name: "Heads", value: "heads" },
        { name: "Tails", value: "tails" },
      ],
    },
    {
        name: "opponent",
        description: "Mention your opponent.",
        type: "USER",
        required: "False"
    }
  ],
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const choices = interaction.options.getString("choice");
    const opponent = interaction.options.getUser("opponent");

    const Response = new MessageEmbed().setColor(fun_embed_colour).setDescription("\n <a:dogecoin:930531317463003247> **Flipping coin** <a:dogecoin:930531317463003247>");

    if(opponent) {
        Response.addFields(
            {name: "Coin flipper", value: `${interaction.member}`},
            {name: "Opponent", value: `${opponent}`}
        )
    }

    var message = await interaction.channel.send({embeds: [Response]})
    interaction.reply({embeds: [new MessageEmbed().setColor(fun_embed_colour).setDescription("<a:animated_tick:925091839030231071> Flipping coin")], ephemeral: true})

    // for (var i = 0; i < 10; i++) {
    //     const coin = answers[Math.floor(Math.random() * answers.length)];
    //     await message.edit({embeds: [Response.setDescription(`**Flipping coin** \n\n**${coin.toUpperCase()}**`)]})
    //     await delay(100)
    // }

    await delay(5000)

    const headswinembed = new MessageEmbed()
      .setTitle("Its a heads!")
      .setDescription(`🥳 The coin landed on heads.`)
      .addFields(
        {name: "Winner", value: `${interaction.member}`},
        {name: "Loser", value: `${opponent || "You played the coin."}`}
    )
      .setColor(fun_embed_colour);

    const tailslooseembed = new MessageEmbed()
      .setTitle("Its a tails!")
      .setDescription(`😔 The coin landed on tails but you chose heads.`)
      .addFields(
          {name: "Winner", value: `${opponent || "You played the coin."}`},
          {name: "Loser", value: `${interaction.member}`}
      )
      .setColor("RED");

    const tailswinembed = new MessageEmbed()
      .setTitle("Its a tails!")
      .setDescription(`🥳 The coin landed on tails.`)
      .addFields(
        {name: "Winner", value: `${interaction.member}`},
        {name: "Loser", value: `${opponent || "You played the coin."}`}
    )
      .setColor(fun_embed_colour);

    const headslooseembed = new MessageEmbed()
      .setTitle("Its a heads!")
      .setDescription(
        `😔 The coin landed on heads but you chose tails.`)
      .addFields(
        {name: "Winner", value: `${opponent || "You played the coin."}`},
        {name: "Loser", value: `${interaction.member}`}
      )
      .setColor("RED");

    const coin = answers[Math.floor(Math.random() * answers.length)];
    if (choices === "heads") {
      if (coin === "heads") {
        message.edit({ embeds: [headswinembed] });
      } else if (coin === "tails") {
        message.edit({ embeds: [tailslooseembed] });
      }
    }

    if (choices === "tails") {
      if (coin === "tails") {
        message.edit({ embeds: [tailswinembed] });
      } else if (coin === "heads") {
        message.edit({ embeds: [headslooseembed] });
      }
    }
  },
};
