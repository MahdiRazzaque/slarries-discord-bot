const { Client, MessageEmbed, Message } = require("discord.js");
const { channel_log_colour, channel_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "channelCreate",
  disabled: false,
  /**
   * @param {Channel} channel
   * @param {Client} client
   */
  execute(channel, client) {

    const Log = new MessageEmbed()
      .setColor(channel_log_colour)
      .setTitle("__Channel Created📺__")
      .setDescription(`A channel was **created**`)
      .addFields({ name: "**Channel**", value: `${channel}` })
      .setTimestamp();

    const channel_logs = client.channels.cache
      .get(channel_logs_id)
      .send({ embeds: [Log] });
  },
};
