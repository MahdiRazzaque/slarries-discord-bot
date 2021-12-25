const { Client, MessageEmbed, Message } = require("discord.js");
const {
  guild_log_colour,
  guild_logs_id,
  guildBanRemove_logging,
} = require("../../structures/config");

module.exports = {
  name: "guildBanRemove",
  /**
   * @param {Client} client
   * @param {guildMember} member
   */
  execute(ban, client) {
    if (!guildBanRemove_logging) return;
    const { user, guild } = ban;

    const Log = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("__Member Unbanned__🔨")
    .setDescription(`${user} was unbanned from ${guild.name}`)
    .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
    .addField("ID", `${user.id}`)
    .setTimestamp();

    const guild_logs = client.channels.cache
    .get(guild_logs_id)
    .send({ embeds: [Log] });
  },
};
