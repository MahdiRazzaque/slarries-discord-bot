const { Client, MessageEmbed, Message } = require("discord.js");
const { role_log_colour, role_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "roleDelete",
  disabled: false,
  /**
   * @param {Role} role
   * @param {Client} client
   */
  execute(role, client) {
    
    const Log = new MessageEmbed()
      .setColor(role_log_colour)
      .setTitle("__Deleted Role 📜__")
      .setDescription(`A role was **deleted**.`)
      .addFields({ name: "**Role**", value: `${role.name}` })
      .setTimestamp();

    const role_logs = client.channels.cache
      .get(role_logs_id)
      .send({ embeds: [Log] });

  },
};
