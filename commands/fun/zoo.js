const { CommandInteraction, MessageEmbed } = require("discord.js");
const axios = require("axios");
const { zoo_disabled, fun_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "zoo",
  description: "Gives images and facts about animals",
  usage: "/zoo",
  options: [
    {
      name: "animal",
      description: "Choose an animal",
      type: "STRING",
      required: true,
      choices: [
        { name: "Bird", value: "bird" },
        { name: "Cat", value: "cat" },
        { name: "Dog", value: "dog" },
        { name: "Panda", value: "panda" },
        { name: "Fox", value: "fox" },
        { name: "Red_Panda", value: "red_panda" },
        { name: "Koala", value: "koala" },
        { name: "Raccoon", value: "raccoon" },
        { name: "Whale", value: "whale" },
        { name: "Kangaroo", value: "kangaroo" },
      ],
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (zoo_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setTitle("**Command Disabled** ❌")], ephemeral: true})};;
            
    const animal = interaction.options.getString("animal");
    const animalString = animal.replace("_", " ");
    const capitalized = animalString.charAt(0).toUpperCase() + animalString.slice(1);
    const url = `https://some-random-api.ml/animal/${animal}`;

    const errembed = new MessageEmbed()
      .setColor("RED")
      .setDescription(`❌ **|** An error occured while running this command ╰（‵□′）╯`)
      .addField("Error Info", `\`\`\`The API that we're using probably in maintenance\`\`\``);

    let data, response;

    try {
      response = await axios.get(url);
      data = response.data;
    } catch (e) {
      return interaction.reply({ embeds: [errembed] });
    }

    const embed = new MessageEmbed()
      .setAuthor(`Here is a photo of a cute ${animalString}!`)
      .setColor(fun_embed_colour)
      .setImage(data.image)
      .setFooter(`Executed by ${interaction.user.tag}`)
      .setTimestamp();
    
      const factsembed = new MessageEmbed()
      .setAuthor(`${capitalized} facts`)
      .setColor(fun_embed_colour)
      .setDescription(`${data.fact}`);
    
      interaction.reply({embeds: [factsembed, embed]});
  },
};
