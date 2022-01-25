const { CommandInteraction, MessageEmbed } = require("discord.js");
const superagent = require("superagent");
const { fun_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "8ball",
  description: "Answers All Your Questions",
  usage: "/8ball [question]",
  disabled: false,
  botCommandChannelOnly: true,
  options: [
    {
      name: "question",
      description: "Ask The Question",
      type: "STRING",
      required: true,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {    
    let { body } = await superagent.get(`https://nekos.life/api/v2/8ball`);

    const question = interaction.options.getString("question");

    if (question.length > 2000){
      return interaction.reply({embeds: [new MessageEmbed().setTitle(`${client.emojisObj.animated_cross} Can't run code with the strings given.`).setColor("RED").setDescription("Question Can't Be More Than 2000 Characters")]});
    }

    const Response = new MessageEmbed()
      .setAuthor({name: `${interaction.member.user.username}`, iconURL: `${interaction.member.user.avatarURL({dynamic: true, size: 512})}`})
      .setColor(fun_embed_colour)
      .setTimestamp()
      .setFields({name: "Question", value: question})
      .setImage(body.url)
      .setFooter({text: `Requested by: ${interaction.member.user.username}`});

    interaction.reply({embeds: [Response]});
  },
};
