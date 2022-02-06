const { Client, MessageEmbed, GuildChannel } = require("discord.js");
const { channel_log_colour, channel_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "channelDelete",
  disabled: false,
  /**
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  execute(channel, client) {

    const channel_logs = client.channels.cache.get(channel_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)
   
    const Log = new MessageEmbed()
      .setColor(channel_log_colour)
      .setTitle("__Channel Deleted📺__")
      .setDescription(`A channel was **deleted** guild_logs`)
      .addFields({ name: "**Channel**", value: `\`${channel.name}\`` })
      .setTimestamp();

    channel_logs.send({ embeds: [Log] });
  },
};
