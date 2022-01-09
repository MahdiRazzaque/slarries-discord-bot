const { Client, MessageEmbed, Message, GuildMember } = require("discord.js");
const { role_logs_colour, role_logs_id, memberRoleChange_logging } = require("../../structures/config.json");

module.exports = {
  name: "guildMemberUpdate",
  /**
   * @param {Client} client
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   */
  execute(oldMember, newMember, client) {
    if (!memberRoleChange_logging) return;
    if(oldMember.roles == newMember.roles) return;

    const Log = new MessageEmbed()
      .setColor(role_logs_colour)
      .setTimestamp()
      .setTitle("Roles changed__ 😛")
      .setDescription(`A member's roles was updated.`)
      .addFields(
        {name: "Member", value: `${newMember}`},
        {name: "ID", value: `${newMember.id}`},
        {name: "Old roles", value: `${oldMember.roles.cache.map((r) => r).join(", ").replace("@everyone", "") || "None"}`},
        {name: "New roles", value: `${newMember.roles.cache.map((r) => r).join(", ").replace("@everyone", "") || "None"}`},         
      )

    const role_logs = client.channels.cache
    .get(role_logs_id)
    .send({ embeds: [Log] });
  },
};
