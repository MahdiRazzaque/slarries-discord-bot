const { Client, MessageEmbed, Channel, Permissions } = require("discord.js");
const { channel_log_colour, channel_logs_id } = require("../../structures/config.json");
const ms = require("ms");

module.exports = {
  name: "channelUpdate",
  disabled: false,
  /**
   * @param {Channel} oldChannel
   * @param {Channel} newChannel
   * @param {Client} client
   */
  async execute(oldChannel, newChannel, client) {
    if(!oldChannel.guild) return;
    if(oldChannel.type === "GUILD_NEWS_THREAD") return;
    if(oldChannel.type === "GUILD_PUBLIC_THREAD") return;
    if(oldChannel.type === "GUILD_PRIVATE_THREAD ") return;
    if (oldChannel.type == "DM" || oldChannel.type == "GROUP_DM") return;

    if(["916387140227715082", "916387154442223676", "916387156870721647", "916387157864742973"].includes(oldChannel.id)) return;

    const logs = await oldChannel.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first();

    const channel_logs = channel.guild.channels.cache.get(channel_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    switch(log.action) {
      case "CHANNEL_OVERWRITE_CREATE":
        const channelPermissionCreate = new MessageEmbed()
          .setColor(channel_log_colour)
          .setTitle("Channel Updated 📺")
          .setDescription(`${newChannel}'s permisson was **created** <t:${happen}:R>`)
          .setTimestamp()

        if (log.extra.user) {
          channelPermissionCreate.setDescription(`Permissions have been **added** in the channel ${oldChannel} by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addField("Member", `\`${log.extra.user.tag}\``)
        } else {
          channelPermissionCreate.setDescription(`Permissions have been **added** in the channel ${oldChannel} by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addField("Role", `\`${log.extra.name}\``)
        }

        if (log.changes.find(x => x.key == "allow").new !== "0") {
          const p = new Permissions(log.changes.find(x => x.key == "allow").new).toArray().join("\` | \`").toLowerCase().replaceAll("_", " ");
          channelPermissionCreate.addField("Allowed permissions", `\`${p}\``)
        }
        if (log.changes.find(x => x.key == "deny").new !== "0") {
          const p = new Permissions(log.changes.find(x => x.key == "deny").new).toArray().join("\` | \`").toLowerCase().replaceAll("_", " ");
          channelPermissionCreate.addField("Denied permissions", `\`${p}\``)
        }
        channel_logs.send({ embeds: [channelPermissionCreate] });
      break;

      case "CHANNEL_OVERWRITE_UPDATE":
        const channelPermissionUpdate = new MessageEmbed()
        .setColor(channel_log_colour)
        .setTitle("Channel Updated 📺")
        .setDescription(`${newChannel}'s permisson was **updated** <t:${happen}:R>`)
        .setTimestamp()

        if (!log.changes.find(x => x.key == "allow") && !log.changes.find(x => x.key == "deny") && log.changes.find(x => x.key == "allow").new == "0" && log.changes.find(x => x.key == "deny").new == "0") return;

        if (log.extra.user) {
          channelPermissionUpdate.setDescription(`Permissions have been **updated** in the channel ${oldChannel} by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addField("Member", `\`${log.extra.user.tag}\``)
        } else { // Else it means the target is a role
          channelPermissionUpdate.setDescription(`> Permissions have been **updated** in the channel ${oldChannel} by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addField("Role", `\`${log.extra.name}\``)
        }
  
        if (log.changes.find(x => x.key == "allow")) {
          if (log.changes.find(x => x.key == "allow").new && log.changes.find(x => x.key == "allow").new != "0") {
            const p = new Permissions(log.changes.find(x => x.key == "allow").new).toArray().join("\` | \`").toLowerCase().replaceAll("_", " ");
            channelPermissionUpdate.addField("Allowed permissions", `\`${p}\``)
          }
        }
  
        if (log.changes.find(x => x.key == "deny")) {
          if (log.changes.find(x => x.key == "deny").new && log.changes.find(x => x.key == "deny").new != "0") {
            const p = new Permissions(log.changes.find(x => x.key == "deny").new).toArray().join("\` | \`").toLowerCase().replaceAll("_", " ");
            channelPermissionUpdate.addField("Denied permissions", `\`${p}\``)
          }
        }
        channel_logs.send({ embeds: [channelPermissionUpdate] });
      break;

      case "CHANNEL_OVERWRITE_DELETE":
        const channelPermissionDelete  = new MessageEmbed()
          .setColor(channel_log_colour)
          .setTitle("Channel Updated 📺")
          .setDescription(`${newChannel}'s permisson was **deleted** <t:${happen}:R>.`)
          .setTimestamp()

        if (log.extra.user) { 
          channelPermissionDelete.setDescription(`Permissions have been **deleted** in the channel ${oldChannel} by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addField("Member", `\`${log.extra.user.tag}\``)
        } else { 
          channelPermissionDelete.setDescription(`Permissions have been **deleted** in the channel ${oldChannel} by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addField("Role", `\`${log.extra.name}\``)
        }
        channel_logs.send({ embeds: [channelPermissionDelete] });
      break;
      
      case "CHANNEL_UPDATE":
        const channelUpdateLogEmbed  = new MessageEmbed()
          .setColor(channel_log_colour)
          .setTitle("Channel Updated 📺")
          .setDescription(`${newChannel}'s was **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
          .setTimestamp()

        if (oldChannel.name !== newChannel.name) { 
          channelUpdateLogEmbed.setDescription(`${newChannel}'s name has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            .addFields(
              { name: "Old name", value: `\`${oldChannel.name}\``, inline: true },
              { name: "New name", value: `\`${newChannel.name}\``, inline: true }
            )
        }

        if (oldChannel.type == "GUILD_VOICE" || oldChannel.type == "GUILD_STAGE_VOICE") {
          if (oldChannel.bitrate !== newChannel.bitrate) {
            channelUpdateLogEmbed.setDescription(`${newChannel}'s bitrate has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
              .addFields(
                { name: "Old bitrate", value: `${oldChannel.bitrate} bps`, inline: true },
                { name: "New bitrate", value: `${newChannel.bitrate} bps`, inline: true }
              )
          }
        };

        if (oldChannel.type == "GUILD_TEXT" || oldChannel.type == "GUILD_NEWS") {

          if(oldChannel.nsfw !== newChannel.nsfw) {
              channelUpdateLogEmbed.setDescription(`${newChannel}'s nsfw was **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
              .addFields(
                { name: "Old nsfw", value: `\`${oldChannel.nsfw}\``, inline: true },
                { name: "New nsfw", value: `\`${newChannel.nsfw}\``, inline: true }
              )
              .setTimestamp();
          }
  
          if (oldChannel.topic !== newChannel.topic) {
            channelUpdateLogEmbed.setDescription(`${newChannel}'s topic has been **updated** by ${log.executor.tag} <t:${happen}:R>.`)
              .addFields(
                { name: "Old topic", value: oldChannel.topic ? `\`${oldChannel.topic}\`` : "\`No topic before\`", inline: true },
                { name: "New topic", value: newChannel.topic ? `\`${newChannel.topic}\`` : "\`No new topic\`", inline: true }
              )
  
          }

          if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
            channelUpdateLogEmbed.setDescription(`${oldChannel}'s cooldown has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
              .addFields(
                { name: "Old cooldown", value: `\`${ms(oldChannel.rateLimitPerUser * 1000)}\``, inline: true },
                { name: "New cooldown", value: `\`${ms(newChannel.rateLimitPerUser * 1000)}\``, inline: true }
              )
          }

          if (oldChannel.defaultAutoArchiveDuration !== newChannel.defaultAutoArchiveDuration) { 
            channelUpdateLogEmbed.setDescription(`${oldChannel}'s thread auto-archive has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
              .addFields(
                { name: "Old thread auto-archive", value: `\`${ms(oldChannel.defaultAutoArchiveDuration * 60000)}\``, inline: true },
                { name: "New thread auto-archive", value: `\`${ms(newChannel.defaultAutoArchiveDuration * 60000)}\``, inline: true }
              )
          };
          channel_logs.send({ embeds: [channelUpdateLogEmbed] });
        }
      break;
      default:
        const channelUpdateEmbed  = new MessageEmbed()
          .setColor(channel_log_colour)
          .setTitle("Channel Updated 📺")
          .setDescription(`${newChannel}'s was **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
          .setTimestamp()

        if (oldChannel.parentId !== newChannel.parentId && oldChannel.type !== "GUILD_CATEGORY") {
          channelUpdateEmbed.setDescription(`> The parent category of ${oldChannel} has been changed`)
            .addFields(
              { name: "Old parent", value: oldChannel.parent ? `\`${oldChannel.parent.name}\`` : "\`No parent before\`" },
              { name: "New parent", value: newChannel.parent ? `\`${newChannel.parent.name}\`` : "\`No new parent\`" }
            );
            channel_logs.send({ embeds: [channelUpdateLogEmbed] });
        };
      }
  
  },
};
