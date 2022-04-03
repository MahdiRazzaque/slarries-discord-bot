const { Client, MessageEmbed, Message, GuildChannel } = require("discord.js");
const { channel_log_colour, channel_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "webhookUpdate",
  disabled: false,
  /**
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  async execute(channel, client) {
      
    const logs = await channel.guild.fetchAuditLogs({
        limit: 1,
      });
    const log = logs.entries.first(); 

    if(!log) 
        return;

    const channel_logs = channel.guild.channels.cache.get(channel_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)
  
    if (!log.target || log.target.bot) return;

    if (log.action != "WEBHOOK_UPDATE") return;

    const webhookUpdate = new MessageEmbed()
        .setColor(channel_log_colour)
        .setTitle("Channel's Webhook Update 🕸️")
        .setTimestamp();

    if (log.changes.find(x => x.key == "avatar_hash")) { 

        webhookUpdate.setDescription(`The avatar of the webhook \`${log.target.name}\` has been **updated** <t:${happen}:R>.`)
        .setImage(`https://cdn.discordapp.com/avatars/${log.target.id}/${log.changes.find(x => x.key == "avatar_hash").new}.webp`)
        .addFields(
            { name: "Old avatar", value: log.changes.find(x => x.key == "avatar_hash").old ? `https://cdn.discordapp.com/avatars/${log.target.id}/${log.changes.find(x => x.key == "avatar_hash").old}.webp` : "No avatar before" },
            { name: "New avatar", value: log.changes.find(x => x.key == "avatar_hash").new ? `https://cdn.discordapp.com/avatars/${log.target.id}/${log.changes.find(x => x.key == "avatar_hash").new}.webp` : "No new avatar" }
        )
    }

    if (log.changes.find(x => x.key == "name")) {
        webhookUpdate.setDescription(`The name of the webhook \`${log.changes.find(x => x.key == "name").new}\` has been updated <t:${happen}:R>.`)
        .addFields(
            { name: "Old name", value: `\`${log.changes.find(x => x.key == "name").old}\`` },
            { name: "New name", value: `\`${log.changes.find(x => x.key == "name").new}\`` }
        )
    }

    if (log.changes.find(x => x.key == "channel_id")) {

        webhookUpdate.setDescription(`The channel of the webhook \`${log.target.name}\` has been updated <t:${happen}:R>.`)
        .addFields(
            { name: "Old channel", value: log.changes.find(x => x.key == "channel_id").old ? `<#${log.changes.find(x => x.key == "channel_id").old}>` : "No channel before" },
            { name: "New channel", value: log.changes.find(x => x.key == "channel_id").new ? `<#${log.changes.find(x => x.key == "channel_id").new}>` : "No new channel" }
        )
    }
    
    channel_logs.send({ embeds: [webhookUpdate] });
  },
};
