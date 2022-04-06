const { Client, MessageEmbed, Message, Permissions, Role } = require("discord.js");
const { role_log_colour, role_logs_id} = require("../../structures/config.json");

module.exports = {
  name: "roleCreate",
  disabled: false,
  /**
   * @param {Role} role
   * @param {Client} client
   */
  async execute(role, client) {

    const role_logs = role.guild.channels.cache.get(role_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await role.guild.fetchAuditLogs({
      limit: 1,
      type: "ROLE_CREATE"
    })
    const log = logs.entries.first();

    if(!log) return;
    
    const roleCreate = new MessageEmbed()
      .setColor(role_log_colour)
      .setTitle("Role Created 📜")
      .setDescription(`The role \`${role.name}\` has been **created** by \`${log.executor.tag}\` <t:${happen}:R>.`)
      .addFields(
        { name: "Color", value: `\`${role.color}\``, inline: true },
        { name: "Hoisted", value: role.hoist ? "\`Yes\`" : "\`No\`", inline: true },
        { name: "Mentionable", value: role.mentionable ? "\`Yes\`" : "\`No\`", inline: true },
        { name: "Position", value: `\`${role.position - 1}\``, inline: true }
      )
      .setTimestamp();

    if (role.permissions.bitfield !== "0") {
      const p = new Permissions(role.permissions.bitfield).toArray().slice(" ").map(e => `\`${e}\``).join(" ").toLowerCase().replaceAll("_", " ");

      roleCreate.addField("Permissions", p)
    }

    role_logs.send({ embeds: [roleCreate] });
  },
};
