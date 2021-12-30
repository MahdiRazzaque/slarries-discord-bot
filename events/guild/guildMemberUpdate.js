const { Client, MessageEmbed, Message } = require("discord.js");
const { guild_log_colour, guild_logs_id, guildMemberUpdate_logging } = require("../../structures/config.json");

module.exports = {
  name: "guildMemberUpdate",
  /**
   * @param {Client} client
   * @param {guildMember} member
   */
  execute(oldMember, newMember, client) {
    if (!guildMemberUpdate_logging) return;

    const Log = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("__Guild Member Updated__ 👶")
    .setTimestamp();

    if(oldMember.nickname !== newMember.nickname) {
        Log.addField({name: "Nickname Changed", value: `Old nickname: ${oldMember.nickname}\n New nickname: ${newMember.nickname}`})
    }

    const guild_logs = client.channels.cache
    .get(guild_logs_id)
    .send({ embeds: [Log] });
  },
};
