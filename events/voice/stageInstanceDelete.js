const { Client, MessageEmbed, Message, StageInstance } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "stageInstanceDelete",
  disabled: false,
  /**
   * @param {StageInstance} thread
   * @param {Client} client
   */
  async execute(stageInstance, client) {

    const guild_logs = stageInstance.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await stageInstance.guild.fetchAuditLogs({
      limit: 1,
      type: "STAGE_INSTANCE_DELETE"
    })
    const log = logs.entries.first();

    if(!log) return;

    const stageInstanceDelete = new MessageEmbed()
      .setColor(guild_log_colour)
      .setTitle("Stage Deleted 🎤")
      .setDescription(`A stage instance has been **stopped** in ${stageInstance.channel} by \`${log.executor.tag}\` <t:${happen}:R>.`)
      .setTimestamp() 

      guild_logs.send({ embeds: [stageInstanceDelete] });
  },
};
