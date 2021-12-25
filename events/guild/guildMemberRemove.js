const { Client, MessageEmbed, Message } = require("discord.js");
const {
  guild_log_colour,
  guild_logs_id,
  guildMemberRemove_logging,
} = require("../../structures/config");

module.exports = {
  name: "guildMemberRemove",
  /**
   * @param {Client} client
   * @param {guildMember} member
   */
  execute(member, client) {
    if (guildMemberRemove_logging) {
      const { user, guild } = member;

      const Log = new MessageEmbed()
        .setColor(guild_log_colour)
        .setTitle("__Member Left__🏃‍♂️")
        .setDescription(`${user} left the server.`)
        .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
        .addField("ID", `${user.id}`)
        .setTimestamp();

      const guild_logs = client.channels.cache
        .get(guild_logs_id)
        .send({ embeds: [Log] });
    } else {
      return;
    }
  },
};
