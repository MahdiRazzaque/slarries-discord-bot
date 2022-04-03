const { Client, MessageEmbed, GuildBan } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "guildBanAdd",
  disabled: false,
  /**
   * @param {Client} client
   * @param {GuildBan} ban
   */
  async execute(ban, client) {

    const logs = await ban.guild.fetchAuditLogs({
      type: "MEMBER_BAN_ADD",
      limit: 1,
    })
    const log = logs.entries.first();

    const guild_logs = ban.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const guildBanAdd = new MessageEmbed()
      .setColor(guild_log_colour)
      .setTitle("Member Banned 🔨")
      .setTimestamp();

    if (log) {
      guildBanAdd.setDescription(`\`${log.target.tag}\` has been banned from this guild by \`${log.executor.tag}\` <t:${happen}:R>.`);
      guildBanRemove.addField("ID", log.target.id)

      if (log.reason) guildBanAdd.addField("Reason", log.reason)
    } else {
      guildBanAdd.setDescription(`\`${ban.user.tag}\` has been banned from this guild <t:${happen}:R>.`);
      guildBanRemove.addField("ID", log.target.id)
    }

    guild_logs.send({ embeds: [guildBanAdd] });
  },
};
