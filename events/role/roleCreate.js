const { Client, MessageEmbed, Message } = require("discord.js");
const {
  role_log_colour,
  role_logs_id,
  roleCreate_logging,
} = require("../../structures/config");

module.exports = {
  name: "roleCreate",
  /**
   * @param {Role} role
   * @param {Client} client
   */
  execute(role, client) {
    if (!roleCreate_logging) return;
    
    const Log = new MessageEmbed()
      .setColor(role_log_colour)
      .setTitle("__Role Created📜__")
      .setDescription(`A role was **created**.`)
      .addFields({ name: "**Role**", value: `${role}` })
      .setTimestamp();

    const role_logs = client.channels.cache
      .get(role_logs_id)
      .send({ embeds: [Log] });
  },
};
