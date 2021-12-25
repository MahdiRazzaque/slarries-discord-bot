const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { connection } = require("mongoose");
const { status_disabled, developer_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "status",
  description: "Displays the status of the client and database connection.",
  usage: "/status",
  permission: "ADMINISTRATOR",
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (status_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setTitle("**Command Disabled** ❌")], ephemeral: true})};
      
    const Response = new MessageEmbed()
      .setColor(developer_embed_colour)
      .setTitle("Status")
      .addFields(
        { name: "**Client** 🕵️", value: `🟢 Online` },
        { name: "**Ping 🏓**", value: `${client.ws.ping}ms` },
        { name: "**Uptime** 📈", value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>` },
        { name: "**Database** 📚", value: `${switchTo(connection.readyState)}` }
      )
    interaction.reply({ embeds: [Response] });
  },
};

function switchTo(val) {
  var status = " ";
  switch (val) {
    case 0:
      status = `🔴 DISCONNECTED`;
      break;
    case 1:
      status = `🟢 CONNECTED`;
      break;
    case 2:
      status = `🟠 CONNECTING`;
      break;
    case 3:
      status = `🟣 DISCONNECTING`;
      break;
  }
  return status;
}
