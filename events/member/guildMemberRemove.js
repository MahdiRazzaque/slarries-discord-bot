const { Client, MessageEmbed, Message } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "guildMemberRemove",
  disabled: false,
  /**
   * @param {Client} client
   * @param {guildMember} member
   */
  async execute(member, client) {

    const guild_logs = member.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await member.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first();

    if(!log) return;

    const guildMemberRemove = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("Member Left 🏃‍♂️")
    .setThumbnail(member.user.avatarURL({ dynamic: true, size: 512 }))
    .addFields(
      {name: "ID", value: member.user.id, inline: true},
    )
    .setTimestamp();

    switch(log.action) {
      case "MEMBER_KICK":
        guildMemberRemove.setTitle("Member Kicked 🦶")
        guildMemberRemove.setDescription(`\`${log.target.tag}\` has been kicked from this guild by \`${log.executor.tag}\` <t:${happen}:R>.`)
        if (log.reason)
          guildMemberRemove.addField("Reason", `\`${log.reason}\``)

        guild_logs.send({ embeds: [guildMemberRemove] });
      break;

      case "MEMBER_PRUNE":
        guildMemberRemove.setDescription(`\`${log.target.tag}\` has been prunned from this guild by \`${log.executor.tag}\` <t:${happen}:R>.`)
        if (log.reason)
          guildMemberRemove.addField("Reason", `\`${log.reason}\``)

        guild_logs.send({ embeds: [guildMemberRemove] });
      break;
      
      default:
        guildMemberRemove.setDescription(`${member} left the server <t:${happen}:R>.`)
        
        guild_logs.send({ embeds: [guildMemberRemove] });
    }
  },
};
