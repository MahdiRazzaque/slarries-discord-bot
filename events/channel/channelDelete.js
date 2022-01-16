const { Client, MessageEmbed, Message } = require("discord.js");
const { channel_log_colour, channel_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "channelDelete",
  disabled: false,
  /**
   * @param {Channel} channel
   * @param {Client} client
   */
  execute(channel, client) {
   
    const Log = new MessageEmbed()
      .setColor(channel_log_colour)
      .setTitle("__Channel Deleted📺__")
      .setDescription(`A channel was **deleted**`)
      .addFields({ name: "**Channel**", value: `${channel.name}` })
      .setTimestamp();

    const channel_logs = client.channels.cache
      .get(channel_logs_id)
      .send({ embeds: [Log] });
  },
};
