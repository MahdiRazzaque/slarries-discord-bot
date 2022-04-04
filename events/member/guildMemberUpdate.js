const { Client, MessageEmbed, MessageAttachment, GuildMember } = require("discord.js");
const { guild_log_colour, guild_logs_id, role_logs_id, role_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "guildMemberUpdate",
  disabled: false,
  /**
   * @param {Client} client
   * @param {GuildMember} member
   */
  async execute(oldMember, newMember, client) {

    const guild_logs = oldMember.guild.channels.cache.get(guild_logs_id)
    const role_logs = oldMember.guild.channels.cache.get(role_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await oldMember.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first();

    if(!log) return;

    const memberUpdateEmbed = new MessageEmbed()
        .setColor(guild_log_colour)
        .setTitle("Member Updated 👥")
        .setThumbnail(oldMember.user.avatarURL({ dynamic: true, size: 512 }))
        .setTimestamp()

    switch(log.action) {
        case "MEMBER_ROLE_UPDATE":
            if (oldMember.roles.cache.size == newMember.roles.cache.size) return;
            const memberRoleUpdate = new MessageEmbed()
                .setColor(role_log_colour)
                .setTitle("Roles Changed ‍⚕️")
                .setThumbnail(oldMember.user.avatarURL({ dynamic: true, size: 512 }))
                .setDescription(`Following roles have been added/removed to ${oldMember} by \`${log.executor.tag}\` <t:${happen}:R>.`)
                .setTimestamp()
      
            if (oldMember.roles.cache.size > newMember.roles.cache.size) {
              const p = log.changes.find(x => x.key == "$remove").new.map(e => `<@&${e.id}>`).join(" ") 
              memberRoleUpdate.setDescription(`Following roles have been removed from ${oldMember} by \`${log.executor.tag}\` <t:${happen}:R>.`)
              memberRoleUpdate.addField("Role(s)", p)
            };
            if (oldMember.roles.cache.size < newMember.roles.cache.size) { 
              const p = log.changes.find(x => x.key == "$add").new.map(e => `<@&${e.id}>`).join(" ")
              memberRoleUpdate.setDescription(`Following roles have been added from ${oldMember} by \`${log.executor.tag}\` <t:${happen}:R>.`)
              memberRoleUpdate.addField("Role(s)", p)
            }
            role_logs.send({ embeds: [memberRoleUpdate] });
        break;
        
        case "MEMBER_UPDATE":
            if (oldMember.nickname !== newMember.nickname) {
                memberUpdateEmbed.setDescription(`${oldMember}'s nickname has been updated by \`${log.executor.tag}\` <t:${happen}:R>.`)
                    .addFields(
                        { name: "Old nickname", value: oldMember.nickname ? `\`${oldMember.nickname}\`` : "\`No nickname before\`" },
                        { name: "New nickname", value: newMember.nickname ? `\`${newMember.nickname}\`` : "\`No new nickname\`" }
                    )
                }

            if (!oldMember.premiumSince && newMember.premiumSince) {
                memberUpdateEmbed.setDescription(`${oldMember} started boosting this server <t:${happen}:R>.`)
            }

            if (oldMember.premiumSince && !newMember.premiumSince) {
                memberUpdateEmbed.setDescription(`${oldMember} stopped boosting this server <t:${happen}:R>.`)
            }

            guild_logs.send({ embeds: [memberUpdateEmbed] });
        break;

        default:
            if (oldMember.avatar != newMember.avatar) {
                memberUpdateEmbed.setDescription(`${oldMember}'s avatar has been updated <t:${happen}:R>.`)
                memberUpdateEmbed.setImage(newMember.avatarURL({ dynamic: true }))
                memberUpdateEmbed.addFields(
                    { name: "Old avatar", value: oldMember.avatar ? `${oldMember.avatarURL({ dynamic: true })}` : "\`No server avatar before\`" },
                    { name: "New avatar", value: newMember.avatar ? `${newMember.avatarURL({ dynamic: true })}` : "\`No new server avatar\`" }
                  )
              }
            guild_logs.send({ embeds: [memberUpdateEmbed] });
        break;
    }
  },
};
