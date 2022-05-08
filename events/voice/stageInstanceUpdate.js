const { Client, MessageEmbed, Message, StageInstance } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "stageInstanceUpdate",
  disabled: false,
  /**
   * @param {StageInstance} oldStageInstance
   * @param {StageInstance} newStageInstance
   * @param {Client} client
   */
  async execute(oldStageInstance, newStageInstance, client) {

    const guild_logs = oldStageInstance.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await oldStageInstance.guild.fetchAuditLogs({
      limit: 1,
      type: "STAGE_INSTANCE_UPDATE"
    })
    const log = logs.entries.first();

    if(!log) return;

    if (oldStageInstance.topic !== newStageInstance.topic) {
        const topicChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Stage Updated 🎤")
            .setTimestamp() 
            .setDescription(`The topic of a stage has been changed in ${oldStageInstance.channel} by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addFields(
                { name: "Old topic", value: `\`${oldStageInstance.topic}\`` },
                { name: "New topic", value: `\`${newStageInstance.topic}\`` }
            )

        guild_logs.send({ embeds: [topicChanged] });
    } else return;  
  },
};
