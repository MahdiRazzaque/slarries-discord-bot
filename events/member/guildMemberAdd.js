const { Client, MessageEmbed, MessageAttachment, GuildMember } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "guildMemberAdd",
  disabled: false,
  /**
   * @param {Client} client
   * @param {GuildMember} member
   */
  async execute(member, client) {

    const guild_logs = member.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await member.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first();

    if(!log) return;

    const guildMemberAdd = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("Member Joined 🐣")
    .setThumbnail(member.user.avatarURL({ dynamic: true, size: 512 }))
    .addFields(
      {name: "ID", value: member.user.id, inline: true},
      {name: "Discord user since", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true}
    )
    .setTimestamp();

    if (log.action == "BOT_ADD") {
      guildMemberAdd.setTitle("Bot Joined 🤖")
      guildMemberAdd.setDescription(`${member} has been added by \`${log.executor.tag}\` to this server <t:${happen}:R>.`)
    } else { 
      guildMemberAdd.setDescription(`${member} just joined the guild <t:${happen}:R>.`)
    }

    guild_logs.send({ embeds: [guildMemberAdd] });
  },
};
