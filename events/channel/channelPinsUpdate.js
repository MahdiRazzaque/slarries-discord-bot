const { Client, MessageEmbed, Message, GuildChannel } = require("discord.js");
const { channel_log_colour, channel_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "channelPinsUpdate",
  disabled: false,
  /**
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  async execute(channel, client) {

    const logs = await channel.guild.fetchAuditLogs({
        limit: 1,
      });
    const log = logs.entries.first(); 

    if(!log) 
        return;

    const channel_logs = channel.guild.channels.cache.get(channel_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const channelPinsUpdate = new MessageEmbed()
      .setColor(channel_log_colour)
      .setTitle("Channel's Pins Updated 📌")
      .setTimestamp();
    
    if (!log.target || log.target.bot) return;

    switch(log.action) {
        case "MESSAGE_PIN":
            channelPinsUpdate.setDescription(`A message by \`${log.target.tag}\` has been pinned in ${channel} by \`${log.executor.tag}\` <t:${happen}:R>.`)
        break;

        case "MESSAGE_UNPIN":
            channelPinsUpdate.setDescription(`A message by \`${log.target.tag}\` has been unpinned from ${channel} by \`${log.executor.tag}\` <t:${happen}:R>.`)
    }

    channel_logs.send({ embeds: [channelPinsUpdate] });
  },
};
