const {
  Message,
  guild,
  message,
  CommandInteraction,
  MessageEmbed,
} = require("discord.js");
const {
  role_disabled,
  moderation_embed_colour,
} = require("../../structures/config.json");

module.exports = {
  name: "role",
  description: "Add or remove the role from the member",
  usage: "/role",
  permission: "MANAGE_ROLES",
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
    if (role_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setTitle("**Command Disabled** ❌")], ephemeral: true})};
    
    const type = interaction.options.getString("type");
    const rolee = interaction.options.getRole("role");
    const target = interaction.options.getMember("member");

    switch (type) {
      case "add": {
          if (target.id === interaction.member.id) {
            return interaction.reply({
              embeds: [new MessageEmbed().setColor("RED").setDescription(`❌ You cannot add roles to yourself.`)], ephemeral: true,});
          } else if (target.roles.highest.position > interaction.member.roles.highest.position) {
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`❌ This member have a superior role!`)], ephemeral: true});
          } else if (target.permissions.has(this.Perms)) {
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`❌ You cannot add roles to someone with the \`${this.Perms}\` permission.`)], ephemeral: true,});
          } else {
            await target.roles.add(rolee).catch(console.error);
            interaction.reply({embeds: [new MessageEmbed().setColor(moderation_embed_colour).setDescription(`✅ Added ${rolee} to ${target}`)], allowedMentions: { users: [] }, ephemeral: true,});
          }
        }
        break;
      case "remove": {
        if (target.roles.highest.position > interaction.member.roles.highest.position) {
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`❌ This member has a superior role!`)], ephemeral: true});
        } else if (!target.roles.cache.has(`${rolee.id}`)) {
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`❌ ${target} does not have this role.`)], allowedMentions: { users: [] }, ephemeral: true});
        } else if (target.id === interaction.member.id) {
          return interaction.reply({embeds: [new MessageEmbed().setColor(moderation_embed_colour).setDescription(`❌ You cannot remove roles from yourself`)], ephemeral: true});
        } else if (target.permissions.has(this.Perms)) {
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`❌ You cannot take roles from members with the \`${this.Perms}\` permission. changed the nickname`)], ephemeral: true});
        } else {
          await target.roles.remove(rolee).catch(console.error);
          interaction.reply({embeds: [new MessageEmbed().setColor(moderation_embed_colour).setDescription(`✅ Removed ${rolee} from ${target} changed the nickname`)], allowedMentions: { users: [] }, ephemeral: true});
        }
        break;
      }
    }
  },
};
