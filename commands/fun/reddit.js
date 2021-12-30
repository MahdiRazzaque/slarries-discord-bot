const { CommandInteraction, MessageEmbed } = require("discord.js");
const axios = require("axios");
const { reddit_disabled, fun_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "reddit",
  description: "request a meme from reddit via subreddits.",
  usage: "/reddit",
  options: [
    {
      name: "name",
      description: "Provide a name of the subreddit.",
      type: "STRING",
      required: true,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    if (reddit_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setDescription("<a:animated_cross:925091847905366096> **Command Disabled**")], ephemeral: true})};
            
    const { options } = interaction;

    const url = "https://meme-api.herokuapp.com/gimme/";

    const name = options.getString("name");

    const meme = url + name;

    let data, response;

    try {
      response = await axios.get(meme);
      data = response.data;
    } catch (e) {
      if (e) {
        if (e.message.startsWith("Request failed with status code")) {
          const Response = new MessageEmbed()
            .setTitle("Error <a:animated_cross:925091847905366096>")
            .setColor("RED")
            .addField(`Subreddit does not exist:`, `\`\`\`${name}\`\`\``);

          await interaction.reply({ embeds: [Response], fetchReply: true });
        } else if (e) {
          const errorEmbed = new MessageEmbed()
            .setTitle("Oh no... <a:animated_cross:925091847905366096>")
            .setColor("RED")
            .addField("Error", `\`\`\`Please try again\`\`\``);
          console.log(e.message);
          return interaction.reply({ embeds: [errorEmbed], fetchReply: true }).then((msg) => {setTimeout(() => msg.delete(), 5000)});
        }
      }
    }

    if (data == null) {
      return;
    } else {
      const Response = new MessageEmbed()
        .setTitle(data.title)
        .setImage(data.url)
        .setColor(fun_embed_colour);

      const message = await interaction.reply({
        embeds: [Response],
        fetchReply: true,
      });
      message.react("👍");
      message.react("👎");
      }
  },
};
