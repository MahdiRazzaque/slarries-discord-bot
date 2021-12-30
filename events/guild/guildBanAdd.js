const { Client, MessageEmbed, Message } = require("discord.js");
const { guild_log_colour, guild_logs_id, guildBanAdd_logging } = require("../../structures/config.json");

module.exports = {
  name: "guildBanAdd",
  /**
   * @param {Client} client
   * @param {guildMember} member
   */
  execute(ban, client) {
    if (!guildBanAdd_logging) return;
    const { user, guild, reason } = ban;

    const Log = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("__Member Banned__🔨")
    .setDescription(`${user} was banned from ${guild.name}`)
    //.addField({name: "Reason", value: `${reason}` || "No reason provided."})
    .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
    .addField("ID", `${user.id}`)
    .setTimestamp();

    console.log(banReason)

    const guild_logs = client.channels.cache
    .get(guild_logs_id)
    .send({ embeds: [Log] });
  },
};
