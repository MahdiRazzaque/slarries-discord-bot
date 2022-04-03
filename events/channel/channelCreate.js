const { Client, MessageEmbed, Message, GuildChannel } = require("discord.js");
const { channel_log_colour, channel_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "channelCreate",
  disabled: false,
  /**
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  async execute(channel, client) {

    if (channel.type == "DM" || channel.type == "GROUP_DM") return;

    const logs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: "CHANNEL_CREATE"
    })
    const log = logs.entries.first();

    if(!log) return;

    const channel_logs = channel.guild.channels.cache.get(channel_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const channelCreate = new MessageEmbed()
      .setColor(channel_log_colour)
      .setTitle("Channel Created 📺")
      .setDescription(`A channel was **created** by \`${log.executor.tag}\` <t:${happen}:R>.`)
      .addFields(
        { name: "**Channel**", value: `\`${channel.name}\``, inline: true }, 
        { name: "Type", value: `\`${channel.type.slice(6).toLowerCase().replaceAll("_", " ")}\``, inline: true})
      .setTimestamp();

    if (channel.type !== "GUILD_CATEGORY") {
      channelCreate.addField("Parent category", channel.parentId ? `\`${channel.parent.name}\`` : "\`No parent channel\`", true)
    }

    channel_logs.send({ embeds: [channelCreate] });
  },
};
