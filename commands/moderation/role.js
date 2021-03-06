const { CommandInteraction, MessageEmbed } = require("discord.js");
const { moderation_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "role",
  description: "Add or remove the role from the member",
  usage: "/role",
  userPermissions: ["MANAGE_ROLES"],
  disabled: false,
  options: [
    {
      name: "type",
      description: "Choose between adding or removing the role from member",
      type: "STRING",
      required: true,
      choices: [
        {
          name: "add",
          value: "add",
        },
        {
          name: "remove",
          value: "remove",
        },
      ],
    },
    {
      name: "role",
      description: "Mention the role",
      type: "ROLE",
      required: true,
    },
    {
      name: "member",
      description: "Mention the member",
      type: "USER",
      required: true,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {arguments} arguments
   */
  async execute(interaction, guild, client) {   
    const type = interaction.options.getString("type");
    const rolee = interaction.options.getRole("role");
    const target = interaction.options.getMember("member");

    switch (type) {
      case "add": {
          if (target.id === interaction.member.id) {
            return interaction.reply({
              embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> You cannot add roles to yourself.`)], ephemeral: true,});
          } else if (target.roles.highest.position > interaction.member.roles.highest.position) {
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> This member have a superior role!`)], ephemeral: true});
          } else if (target.permissions.has(this.Perms)) {
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> You cannot add roles to someone with the \`${this.Perms}\` permission.`)], ephemeral: true,});
          } else {
            await target.roles.add(rolee).catch(console.error);
            interaction.reply({embeds: [new MessageEmbed().setColor(moderation_embed_colour).setDescription(`<a:animated_tick:925091839030231071> Added ${rolee} to ${target}`)], allowedMentions: { users: [] }, ephemeral: true,});
          }
        }
        break;
      case "remove": {
        if (target.roles.highest.position > interaction.member.roles.highest.position) {
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> This member has a superior role!`)], ephemeral: true});
        } else if (!target.roles.cache.has(`${rolee.id}`)) {
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> ${target} does not have this role.`)], allowedMentions: { users: [] }, ephemeral: true});
        } else if (target.id === interaction.member.id) {
          return interaction.reply({embeds: [new MessageEmbed().setColor(moderation_embed_colour).setDescription(`<a:animated_cross:925091847905366096> You cannot remove roles from yourself`)], ephemeral: true});
        } else if (target.permissions.has(this.Perms)) {
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> You cannot take roles from members with the \`${this.Perms}\` permission. changed the nickname`)], ephemeral: true});
        } else {
          await target.roles.remove(rolee).catch(console.error);
          interaction.reply({embeds: [new MessageEmbed().setColor(moderation_embed_colour).setDescription(`<a:animated_tick:925091839030231071> Removed ${rolee} from ${target} changed the nickname`)], allowedMentions: { users: [] }, ephemeral: true});
        }
        break;
      }
    }
  },
};
