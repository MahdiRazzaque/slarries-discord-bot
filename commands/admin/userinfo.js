const { ContextMenuInteraction, MessageEmbed, Message } = require("discord.js");
const { admin_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "userinfo",
  type: "USER",
  usage: "Profile > Apps > userinfo",
  permission: "ADMINISTRATOR",
  disabled: false,

  /**
   *
   * @param {ContextMenuInteraction} interaction
   */
  async execute(interaction) {    
    const target = await interaction.guild.members.fetch(interaction.targetId);

    const Response = new MessageEmbed()
      .setColor(admin_embed_colour)
      .setAuthor(target.user.tag, target.user.avatarURL({ dynamic: true, size: 512 }))
      .setThumbnail(target.user.avatarURL({ dynamic: true, size: 512 }))
      .addField("ID", `${target.user.id}`)
      .addField("Roles", `${target.roles.cache.map((r) => r).join(" ").replace("@everyone", " ") || "None"}`)
      .addField("Member since", `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
      .addField("Discord User since", `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, true);

    interaction.reply({ embeds: [Response], ephemeral: true });
  },
};
