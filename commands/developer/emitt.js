const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { emmit_disabled, developer_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "emmit",
  description: "Event emitter",
  usage: "/emit",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "member",
      description: "Guild Member Events.",
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
      ],
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    if (emmit_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setTitle("**Command Disabled** ❌")], ephemeral: true})};
    
    const choices = interaction.options.getString("member");

    switch (choices) {
      case "guildMemberAdd": {
        client.emit("guildMemberAdd", interaction.member);
        interaction.reply({embeds: [new MessageEmbed().setColor(developer_embed_colour).setDescription("Emmited a guildMemberAdd event. ✅")],ephemeral: true})
      }
        break;
      case "guildMemberRemove": {
        client.emit("guildMemberRemove", interaction.member);
        interaction.reply({embeds: [new MessageEmbed().setColor(developer_embed_colour).setDescription("Emmited a guildMemberRemove event. ✅")],ephemeral: true})
      }
        break;
    }
  },
};
