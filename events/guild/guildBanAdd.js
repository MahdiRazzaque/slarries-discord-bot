const { Client, MessageEmbed, GuildBan } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "guildBanAdd",
  disabled: false,
  /**
   * @param {Client} client
   * @param {GuildBan} ban
   */
  execute(ban, client) {
    const { user, guild, reason } = ban;

    const Log = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("__Member Banned__🔨")
    .setDescription(`${user} was banned from ${guild.name}`)
    //.addField({name: "Reason", value: `${ban.reason ?? "No reason provided"}` })
    .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
    .addField("ID", `${user.id}`)
    .setTimestamp();

    console.log(banReason)

    const guild_logs = client.channels.cache
    .get(guild_logs_id)
    .send({ embeds: [Log] });
  },
};
