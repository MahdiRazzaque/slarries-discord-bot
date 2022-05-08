const { Client, MessageEmbed, Message, StageInstance } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "stageInstanceCreate",
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
      type: "STAGE_INSTANCE_CREATE"
    })
    const log = logs.entries.first();

    if(!log) return;

    const stageInstanceCreate = new MessageEmbed()
      .setColor(guild_log_colour)
      .setTitle("Stage Created 🎤")
      .setDescription(`A stage instance has been **created** in ${stageInstance.channel} by \`${log.executor.tag}\` <t:${happen}:R>.`)
      .setTimestamp() 
      .addFields(
        { name: "Topic", value: `\`${stageInstance.topic}\`` },
        { name: "Privacy level", value: `\`${stageInstance.privacyLevel.toLowerCase().replace("_", " ")}\``, inline: true },
        { name: "Discovery", value: stageInstance.discoverableDisabled ? `\`Disabled\`` : `\`Enabled\``, inline: true }
      )

      guild_logs.send({ embeds: [stageInstanceCreate] });
  },
};
