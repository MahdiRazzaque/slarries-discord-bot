const { Client, MessageEmbed, MessageAttachment, Presence } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "presenceUpdate",
  disabled: false,
  /**
   * @param {Presence} oldPresence
   * @param {Presence} newPresence
   * @param {Client} client
   */
  async execute(oldPresence, newPresence, client) {

    return;

    if (!oldPresence || !newPresence) return;

    const guild_logs = oldPresence.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await oldPresence.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first();

    if(!log) return;

    const presenceUpdate = new MessageEmbed()
    .setColor(guild_log_colour)
    .setTitle("Member's Presence Updated 👻")
    .setThumbnail(oldPresence.member.user.avatarURL({ dynamic: true, size: 512 }))
    .setTimestamp();

    if (oldPresence.status === newPresence.status) return;
    
    presenceUpdate.setDescription(`The status of ${oldPresence.member} has been updated <t:${happen}:R>.`)
    presenceUpdate.addFields(
        { name: "Old status", value: `\`${oldPresence.status}\`` },
        { name: "New status", value: `\`${newPresence.status}\`` }
    )
      
    guild_logs.send({ embeds: [presenceUpdate] });
  },
};
