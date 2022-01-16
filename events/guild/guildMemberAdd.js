const { Client, MessageEmbed, MessageAttachment } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "guildMemberAdd",
  disabled: false,
  /**
   * @param {Client} client
   * @param {guildMember} member
   */
  async execute(member, client) {
    const { user, guild } = member;

    const Log = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("__Member Joined__🐣")
    .setDescription(`${user} joined the server.`)
    .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
    .addField("ID", `${user.id}`)
    .addField(
        "Discord User since",
        `<t:${parseInt(user.createdTimestamp / 1000)}:R>`,
        true
    )
    .setTimestamp();

    const guild_logs = client.channels.cache
    .get(guild_logs_id)
    .send({ embeds: [Log] });
  },
};
