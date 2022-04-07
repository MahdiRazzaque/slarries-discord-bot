const { CommandInteraction, Client, MessageEmbed, version } = require("discord.js");
const { connection } = require("mongoose");
const os = require("os")
const { developer_embed_colour } = require("../../structures/config.json");


module.exports = {
  name: "status",
  description: "Displays the status of the client and database connection.",
  usage: "/status",
  permission: "ADMINISTRATOR",
  disabled: false,
  botOwnerOnly: true,
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await client.user.fetch();
    await client.application.fetch();
    
    const status = [ "Disconnected", "Connected", "Connecting", "Disconnecting" ];
    
    const Response = new MessageEmbed()
      .setColor(developer_embed_colour)
      .setTitle(`🧙🏻‍♂️ ${client.user.username} Status`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(interaction.client.application.description || "")
      .addFields(
        { name: "🤖 Status", value: `🟢 Online`, inline: true},
        { name: "🧠 Client", value: client.user.tag, inline: true },
        { name: "📆 Created", value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "☑ Verified", value: client.user.flags.has("VERIFIED_BOT") ? "Yes" : "No", inline: true },
        { name: "👩🏻‍💻 Owner", value: `${interaction.client.application.owner.tag || "None"}`, inline: true },
        { name: "📚 Database", value: status[connection.readyState], inline: true },
        { name: "💾 Memory Usage", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%`, inline: true },
        { name: "🖥 System", value: os.type().includes("Windows") ? "Windows" : os.type(), inline: true },
        { name: "👩🏻‍🔧 Node.js", value: process.version, inline: true },
        { name: "🛠 Discord.js", value: version, inline: true },
        { name: "⏰ Up Since", value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`, inline: true },
        { name: "🏓 Ping", value: `${client.ws.ping}ms`, inline: true },
        { name: "🤹🏻‍♀️ Commands", value: `${client.commands.size}`, inline: true },
        { name: "👨‍👩‍👧‍👦 Servers", value: `${client.guilds.cache.size}`, inline: true },
        { name: "👧🏻 Users", value: `${client.users.cache.size}`, inline: true },
      )
      
    interaction.reply({ embeds: [Response] });
  },
};
