const { Client, MessageEmbed, Message, VoiceState } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "voiceStateUpdate",
  disabled: false,
  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @param {Client} client
   */
  async execute(oldState, newState, client) {
    if (oldState.channel === null && newState.channel === null) return;

    const guild_logs = oldState.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const logs = await oldState.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first();

    if(!log) return;

    if (!oldState.serverMute && newState.serverMute) {
        const memberMuted = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Member Muted 🔇")
            .setTimestamp() 
            .setDescription(`${oldState.member} was **muted** on the server (voice channels) <t:${happen}:R>.`)
        guild_logs.send({ embeds: [memberMuted] });
  
    } else if (oldState.serverMute && !newState.serverMute) {
        const memberUnmuted = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Member Unmuted 🔊")
            .setTimestamp() 
            .setDescription(`${oldState.member} was **unmuted** on the server (voice channels) <t:${happen}:R>.`)
        guild_logs.send({ embeds: [memberUnmuted] });
    }

    if (!oldState.serverDeaf && newState.serverDeaf) {
        const memberDeafened = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Member Defeaned 🔇")
            .setTimestamp() 
            .setDescription(`${oldState.member} was **deafened** on the server (voice channels) <t:${happen}:R>.`)
        guild_logs.send({ embeds: [memberDeafened] });
  
      } else if (oldState.serverDeaf && !newState.serverDeaf) {
        const memberUndeafened = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Member Undefeaned 🔊")
            .setTimestamp() 
            .setDescription(`${oldState.member} was **undeafened** on the server (voice channels) <t:${happen}:R>.`)
        guild_logs.send({ embeds: [memberUndeafened] });
      }

    if (!oldState.streaming && newState.streaming) {
        const memberStreaming = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Member Streaming 🎥")
            .setTimestamp() 
            .setDescription(`> ${oldState.member} **started streaming**  in \`${newState.channel.name}\` <t:${happen}:R>.`)
        guild_logs.send({ embeds: [memberStreaming] });

    } else if (oldState.streaming && !newState.streaming) {
        const memberStoppedStreaming = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Member Stopped Streaming 🎥")
            .setTimestamp() 
            .setDescription(`${oldState.member} **stopped streaming**  in \`${newState.channel.name}\` <t:${happen}:R>.`)
        guild_logs.send({ embeds: [memberStoppedStreaming] });
    }

    if (!oldState.channelId && newState.channelId && !oldState.channel && newState.channel) {
        const memberJoinedChannel = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("Member Joined A Channel 📺")
            .setTimestamp() 
          .setDescription(`${oldState.member} **joined** \`${newState.channel.name}\` <t:${happen}:R>.`)
          guild_logs.send({ embeds: [memberJoinedChannel] });
      }

    if (oldState.channelId && !newState.channelId && oldState.channel && !newState.channel) { 
        if (log.action == "MEMBER_DISCONNECT") {
            const memberForceDisconnected = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Member Disconnected From A Channel 📺")
                .setTimestamp()
                .setDescription(`${oldState.member} was **disconnected** from \`${oldState.channel.name}\` by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guild_logs.send({ embeds: [memberForceDisconnected] });
        } else {
            const memberLeftChannel = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Member Disconnected From A Channel 📺")
                .setTimestamp()
                .setDescription(`${oldState.member} has **left** \`${oldState.channel.name}\` <t:${happen}:R>.`)
            guild_logs.send({ embeds: [memberLeftChannel] });
        }

        if (oldState.channelId && newState.channelId && oldState.channel && newState.channel) {
            if (oldState.channelId !== newState.channelId) {
              if (log.action == "MEMBER_MOVE") {
                const memberMoved = new MessageEmbed()
                .setColor(guild_log_colour)
                .setTitle("Member Moved Channels 📺")
                .setTimestamp()
                  .setDescription(`The member ${oldState.member} was **moved** by \`${log.executor.tag}\` <t:${happen}:R>.`)
                  .addFields(
                    { name: "Old channel", value: `\`${oldState.channel.name}\`` },
                    { name: "New channel", value: `\`${newState.channel.name}\`` }
                  )
      
                guild_logs.send({ embeds: [memberMoved] });
              } else {
                const memberSelfMoved = new MessageEmbed()
                    .setColor(guild_log_colour)
                    .setTitle("Member Moved Channels 📺")
                    .setTimestamp()
                    .setDescription(`${oldState.member} **changed** channels <t:${happen}:R>.`)
                    .addFields(
                        { name: "Old channel", value: `\`${oldState.channel.name}\`` },
                        { name: "New channel", value: `\`${newState.channel.name}\`` }
                    )
      
                guild_logs.send({ embeds: [memberSelfMoved] });
              }
            }
        }
    }
  },
};
