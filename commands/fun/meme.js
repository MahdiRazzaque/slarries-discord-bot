const { CommandInteraction, MessageEmbed, Message } = require("discord.js");
const got = require("got");
const { fun_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "meme",
  description: "Get some memes",
  usage: "/meme",
  disabled: false,
  botCommandChannelOnly: true,
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Message} message
   */
  async execute(interaction, message) {   
    got("https://www.reddit.com/r/memes/random/.json").then((response) => {
        const [list] = JSON.parse(response.body);
        const [post] = list.data.children;

        const permalink = post.data.permalink;
        const memeUrl = `https://reddit.com${permalink}`;
        const memeImage = post.data.url;
        const memeTitle = post.data.title;
        const memeUpvotes = post.data.ups;
        const memeNumComments = post.data.num_comments;

        const meme = new MessageEmbed()
          .setTitle(`${memeTitle}`)
          .setURL(`${memeUrl}`)
          .setColor(fun_embed_colour)
          .setImage(memeImage)
          .setFooter({text: `👍 ${memeUpvotes} 💬 ${memeNumComments}`});

        interaction.reply({ embeds: [meme] });
      })
      .catch(console.error);
  },
};
