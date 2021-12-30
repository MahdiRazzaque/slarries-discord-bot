const { ContextMenuInteraction, MessageEmbed, Message } = require("discord.js");
const { userinfo_disabled, admin_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "userinfo",
  type: "USER",
  usage: "Profile > Apps > userinfo",
  permission: "ADMINISTRATOR",

  /**
   *
   * @param {ContextMenuInteraction} interaction
   */
  async execute(interaction) {
    if (userinfo_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setDescription("<a:animated_cross:925091847905366096> **Command Disabled**")], ephemeral: true})};
    
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
