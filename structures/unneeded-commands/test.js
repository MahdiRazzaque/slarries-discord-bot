const fetch = require("node-fetch");



const { MessageEmbed, Message } = require("discord.js");
const { admin_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "test",
  description: "test command",
  usage: "/test",
  permission: "ADMINISTRATOR",
  options: [
    // {
    //   name: "message",
    //   description: "The message that you want to be sent.",
    //   type: "STRING",
    //   required: true,
    // },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {

    // const body = {a: 1};

    // const response = await fetch('https://api.hypixel.net/player?key=cc460244-283e-4554-80cf-481439cb48fb&name=uuqQ');
    // const o = await response.json();
    // const s = JSON.stringify(o)
    // const data = JSON.parse(s)
    // console.log(data)

    // if(data.success === "false" || data.cause === "You have already looked up this name recently") {
    //     return interaction.reply({content: `API limit reached.`})
    // } else {
    //     return interaction.reply({content: `Bedwars games played: ${data.player.stats.Bedwars.games_played_bedwars_1}`})
    //}
    interaction.reply({content: `${Date.now()}`}) 
  },
};
