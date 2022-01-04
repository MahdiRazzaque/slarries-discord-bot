const { Client, CommandInteraction, MessageEmbed, Guild } = require("discord.js");
const { moderation_embed_colour } = require("../../structures/config.json");

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = {
  name: "kick",
  description: "Used to kick a target",
  usage: "/kick",
  permission: "KICK_MEMBERS",
  disabled: false,
  options: [
    {
      name: "target",
      description: "Select a target to kick ",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "Provide a reason to kick that member",
      type: "STRING",
      required: true,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {      
    const { options } = interaction;
    const Target = options.getMember("target");
    const Reason = options.getString("reason");
    const guild = interaction.guild;

    const success = new MessageEmbed()
      .setColor(moderation_embed_colour)
      .addFields(
        { name: "Member kicked 🦶", value: `${Target}` },
        { name: "Reason", value: `${Reason}` },
        { name: "Kicked by", value: `${interaction.member.user}` }
      )
      .setAuthor(Target.user.tag, Target.user.avatarURL({ dynamic: true, size: 512 }))
      .setThumbnail(Target.user.avatarURL({ dynamic: true, size: 512 }));

    if (Target.id === interaction.member.id)
      return interaction.reply({embeds: [new MessageEmbed().setColor(moderation_embed_colour).setTitle("Error <a:animated_cross:925091847905366096>").setDescription("🙄 You can't kick yourself")], ephemeral: true});

    if (Target.permissions.has("ADMINISTRATOR"))
      return interaction.reply({embeds: [new MessageEmbed().setColor(moderation_embed_colour).setTitle("Error <a:animated_cross:925091847905366096>").setDescription("🙄 You can't kick an Admin")], ephemeral: true});

    if (Target.permissions.has("MANAGE_GUILD"))
      return interaction.reply({embeds: [new MessageEmbed().setColor(moderation_embed_colour).setTitle("Error <a:animated_cross:925091847905366096>").setDescription("🙄 You can't kick an Moderator")], ephemeral: true});

    Target.send({embeds: [new MessageEmbed().setColor(moderation_embed_colour).setTitle(`👮 You've been kicked From ${interaction.guild.name}!`).addFields({name: "Reason", value: Reason}, {name: "Kicked by", value: interaction.member.user.tag})]})

    delay(1000).then(() => Target.kick({ reason: Reason }));

    interaction.reply({ embeds: [success] });
  },
};
