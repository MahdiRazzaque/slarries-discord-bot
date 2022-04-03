const { MessageEmbed, Invite, Client } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");
const ms = require("ms");

module.exports = {
  name: "inviteCreate",
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
      type: "INVITE_CREATE"
    })
    const log = logs.entries.first();

    if(!log) return;

    const inviteCreate = new MessageEmbed()
        .setColor(guild_log_colour)
        .setTitle("Invite Created ✉️")
        .setTimestamp()
        .setDescription(`An invite \`${invite.code}\` has been created by \`${log.executor.tag}\` <t:${happen}:R>.`)
        .addFields(
            { name: "Channel", value: `<#${invite.channelId}>` },
            { name: "Expires at", value: invite.maxAge != 0 ? `<t:${parseInt(invite.expiresTimestamp / 1000)}:R>` : "\`Never expires\`" },
            { name: "Maximum age", value: invite.maxAge != 0 ? `\`${ms(invite.maxAge * 1000)}\`` : "\`No limit\`" },
            { name: "Maximum uses", value: invite.maxUses != 0 ? `\`${invite.maxUses}\`` : "\`No max uses\`" }
        )

    if (invite.temporary) 
        inviteCreate.addField("Temporary", `\`Yes\``)

    guild_logs.send({ embeds: [inviteCreate] });
  },
};
