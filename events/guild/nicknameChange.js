const { Client, MessageEmbed, Message, GuildMember } = require("discord.js");
const { guild_log_colour, guild_logs_id, nicknameChange_logging } = require("../../structures/config.json");

module.exports = {
  name: "guildMemberUpdate",
  /**
   * @param {Client} client
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   */
  execute(oldMember, newMember, client) {
    if (!nicknameChange_logging) return;
    if(oldMember.nickname == newMember.nickname) return;

    const Log = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTimestamp()
    .setTitle("__Nickname changed__ 😛")
    .addFields(
    {name: "Member", value: `${newMember}`},
    {name: "ID", value: `${newMember.id}`},
    {name: "Old nickname", value: `${oldMember.nickname || oldMember.displayName}`},
    {name: "New nickname", value: `${newMember.nickname || newMember.displayName}`},         
    )
    Log.setThumbnail(newMember.user.avatarURL({ dynamic: true, size: 512 }))
    
    const guild_logs = client.channels.cache
    .get(guild_logs_id)
    .send({ embeds: [Log] });
  },
};
