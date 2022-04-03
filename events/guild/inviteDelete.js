const { MessageEmbed, Invite, Client } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "inviteDelete",
  disabled: false,
  /**
   * @param {Invite} invite 
   * @param {Client} client
   */
  async execute(invite, client) {

    const guild_logs = invite.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await invite.guild.fetchAuditLogs({
      limit: 1,
      type: "INVITE_DELETE"
    })
    const log = logs.entries.first();

    if(!log) return;

    const inviteDelete = new MessageEmbed()
        .setColor(guild_log_colour)
        .setTitle("Invite Deleted ✉️")
        .setTimestamp()
        .setDescription(`An invite \`${invite.code}\` has been deleted by \`${log.executor.tag}\` <t:${happen}:R>.`)
        .addFields(
            { name: "Channel", value: `<#${invite.channelId}>` },
        )

    guild_logs.send({ embeds: [inviteDelete] });
  },
};
