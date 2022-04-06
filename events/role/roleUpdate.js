const { Client, MessageEmbed, Message, Permissions, Role } = require("discord.js");
const { role_log_colour, role_logs_id} = require("../../structures/config.json");

module.exports = {
  name: "roleUpdate",
  disabled: false,
  /**
   * @param {oldRole} role
   * @param {newRole} role
   * @param {Client} client
   */
  async execute(oldRole, newRole, client) {

    const role_logs = oldRole.guild.channels.cache.get(role_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await oldRole.guild.fetchAuditLogs({
      limit: 1,
      type: "ROLE_UPDATE"
    })
    const log = logs.entries.first();

    if(!log) return;
    
    const roleUpdate = new MessageEmbed()
      .setColor(role_log_colour)
      .setTitle("Role Updated 📜")
      .setTimestamp();


    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
        const oldRolePermissions = new Permissions(oldRole.permissions.bitfield).toArray().slice(" ").map(e => `\`${e}\``)//.join(" ").toLowerCase().replaceAll("_", " ");
        const newRolePermissions = new Permissions(newRole.permissions.bitfield).toArray().slice(" ").map(e => `\`${e}\``)//.join(" ").toLowerCase().replaceAll("_", " ");

        const addedPermissions = newRolePermissions.filter(x => oldRolePermissions.indexOf(x) === -1).join(" ").toLowerCase().replaceAll("_", " ");
        const removedPermissions = oldRolePermissions.filter(x => newRolePermissions.indexOf(x) === -1).join(" ").toLowerCase().replaceAll("_", " ");

        roleUpdate.setDescription(`The permissions of ${newRole} has been changed by \`${log.executor.tag}\` <t:${happen}:R>.`)
        if(addedPermissions)
            roleUpdate.addField("Added permissions", addedPermissions)
        
        if(removedPermissions)
            roleUpdate.addField("Removed permissions", removedPermissions)
        role_logs.send({ embeds: [roleUpdate] });
    }

    if (oldRole.name !== newRole.name) { 
        roleUpdate.setDescription(`The name of ${newRole} has been updated by \`${log.executor.tag}\` <t:${happen}:R>.`)
        roleUpdate.addFields(
            { name: 'Old name', value: `\`${oldRole.name}\`` },
            { name: "New name", value: `\`${newRole.name}\`` }
        )
        role_logs.send({ embeds: [roleUpdate] });
    }

    if (oldRole.icon !== newRole.icon) { 
        roleUpdate.setDescription(`The icon of ${newRole} has been changed by \`${log.executor.tag}\` <t:${happen}:R>.`)
        roleUpdate.setImage(newRole.iconURL())
        roleUpdate.addFields(
            { name: "Old icon", value: oldRole.icon ? `${oldRole.iconURL()}` : "\`No icon before\`" },
            { name: "New icon", value: newRole.icon ? `${newRole.iconURL()}` : "\`No new icon\`" }
          )

          role_logs.send({ embeds: [roleUpdate] });
      }

    if (!oldRole.hoist && newRole.hoist) {
    roleUpdate.setDescription(`The role ${newRole} was made hoist <t:${happen}:R>.`)

    role_logs.send({ embeds: [roleUpdate] });
    } else if (oldRole.hoist && !newRole.hoist) {
    roleUpdate.setDescription(`The role ${newRole} was made not hoist <t:${happen}:R>.`)

    role_logs.send({ embeds: [roleUpdate] });
    };

    if (!oldRole.mentionable && newRole.mentionable) { 
    roleUpdate.setDescription(`The role ${newRole} was made mentionable <t:${happen}:R>.`)

    role_logs.send({ embeds: [roleUpdate] });
    } else if (oldRole.mentionable && !newRole.mentionable) {
    roleUpdate.setDescription(`The role ${newRole} was made not mentionable <t:${happen}:R>.`)

    role_logs.send({ embeds: [roleUpdate] });
    };
  },
};
