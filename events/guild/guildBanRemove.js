const { Client, MessageEmbed, Message } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "guildBanRemove",
  disabled: false,
  /**
   * @param {Client} client
   * @param {guildMember} member
   */
  execute(ban, client) {
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
