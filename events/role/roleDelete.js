const { Client, MessageEmbed, Message, Permissions, Role } = require("discord.js");
const { role_log_colour, role_logs_id} = require("../../structures/config.json");

module.exports = {
  name: "roleDelete",
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
      type: "ROLE_DELETE"
    })
    const log = logs.entries.first();

    if(!log) return;
    
    const roleDelete = new MessageEmbed()
      .setColor(role_log_colour)
      .setTitle("Role Deleted 📜")
      .setDescription(`The role \`${role.name}\` has been **deleted** by \`${log.executor.tag}\` <t:${happen}:R>.`)
      .setTimestamp();

    role_logs.send({ embeds: [roleDelete] });
  },
};
