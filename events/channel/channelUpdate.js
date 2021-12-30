const { Client, MessageEmbed, Message } = require("discord.js");
const { channel_log_colour, channel_logs_id, channelUpdate_logging } = require("../../structures/config.json");

module.exports = {
  name: "channelUpdate",
  /**
   * @param {Channel} channel
   * @param {Client} client
   */
  execute(oldChannel, newChannel, client) {
    if(channelUpdate_logging) return;

    const Log = new MessageEmbed()
    .setColor(channel_log_colour)
    .setTitle("__Channel Updated📺__")
    .setDescription(`A channel was **updated**`)
    .addFields({ name: "**Old Channel**", value: `${oldChannel.name}` })
    .addFields({ name: "**New Channel**", value: `${newChannel}` })
    .setTimestamp();

    const channel_logs = client.channels.cache
    .get(channel_logs_id)
    .send({ embeds: [Log] });
  },
};
