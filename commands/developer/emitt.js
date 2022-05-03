const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { developer_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "emmit",
  description: "Event emitter",
  usage: "/emit",
  userPermissions: ["ADMINISTRATOR"],
  disabled: false,
  botOwnerOnly: true,
  options: [
    {
      name: "event",
      description: "State the event you want to emmit",
      type: "STRING",
      required: true,
      choices: [
        {
          name: "guildMemberAdd",
          value: "guildMemberAdd",
        },
        {
          name: "guildMemberRemove",
          value: "guildMemberRemove",
        },
        {
          name: "guildCreate",
          value: "guildCreate",
        },
      ],
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {    
    const choices = interaction.options.getString("event");


    switch (choices) {
      case "guildMemberAdd": {
        client.emit("guildMemberAdd", interaction.member);
        interaction.reply({embeds: [new MessageEmbed().setColor(developer_embed_colour).setDescription(`${client.emojisObj.animated_tick} Emmited a guildMemberAdd event.`)],ephemeral: true})
      }
        break;
      case "guildMemberRemove": {
        client.emit("guildMemberRemove", interaction.member);
        interaction.reply({embeds: [new MessageEmbed().setColor(developer_embed_colour).setDescription(`${client.emojisObj.animated_tick} Emmited a guildMemberRemove event.`)],ephemeral: true})
      }
        break;
      case "guildCreate": {
        client.emit("guildCreate", interaction.guild);
        interaction.reply({embeds: [new MessageEmbed().setColor(developer_embed_colour).setDescription(`${client.emojisObj.animated_tick} Emmited a guildCreate event.`)],ephemeral: true})
      }
        break;
    }
  },
};