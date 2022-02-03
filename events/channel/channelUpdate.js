const { Client, MessageEmbed, Message, GuildChannel } = require("discord.js");
const { channel_log_colour, channel_logs_id } = require("../../structures/config.json");

module.exports = {
  name: "channelUpdate",
  disabled: false,
  /**
   * @param {GuildChannel} oldChannel
   * @param {GuildChannel} newChannel
   * @param {Client} client
   */
  execute(oldChannel, newChannel, client) {
    if(!oldChannel.guild) return;
    if(oldChannel.type === "GUILD_NEWS_THREAD") return;
    if(oldChannel.type === "GUILD_PUBLIC_THREAD") return;
    if(oldChannel.type === "GUILD_PRIVATE_THREAD ") return;

    if(oldChannel.id === "916387154442223676") return;

    const channel_logs = client.channels.cache.get(channel_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    if(oldChannel.name !== newChannel.name) {
      const Log = new MessageEmbed()
        .setColor(channel_log_colour)
        .setTitle("__Channel Updated📺__")
        .setDescription(`${newChannel}'s name was **updated** <t:${happen}:R>`)
        .addFields(
          { name: "Old name", value: `\`${oldChannel.name}\`` },
          { name: "New name", value: `\`${newChannel.name}\`` }
        )
        .setTimestamp();

        channel_logs.send({ embeds: [Log] });
    }

    if(oldChannel.position !== newChannel.position) {
      const Log = new MessageEmbed()
        .setColor(channel_log_colour)
        .setTitle("__Channel Updated📺__")
        .setDescription(`${newChannel}'s position was **updated** <t:${happen}:R>`)
        .addFields(
          { name: "Old position", value: `\`${oldChannel.position}\`` },
          { name: "New position", value: `\`${newChannel.position}\`` }
        )
        .setTimestamp();

        channel_logs.send({ embeds: [Log] });
    }

    if(oldChannel.type !== newChannel.type) {
      const Log = new MessageEmbed()
        .setColor(channel_log_colour)
        .setTitle("__Channel Updated📺__")
        .setDescription(`${newChannel}'s type was **updated** <t:${happen}:R>`)
        .addFields(
          { name: "Old type", value: `\`${oldChannel.type}\`` },
          { name: "New type", value: `\`${newChannel.type}\`` }
        )
        .setTimestamp();

        channel_logs.send({ embeds: [Log] });
    }
    
    if(oldChannel.nsfw !== newChannel.nsfw) {
      const Log = new MessageEmbed()
        .setColor(channel_log_colour)
        .setTitle("__Channel Updated📺__")
        .setDescription(`${newChannel}'s nsfw was **updated** <t:${happen}:R>`)
        .addFields(
          { name: "Old nsfw", value: `\`${oldChannel.nsfw}\`` },
          { name: "New nsfw", value: `\`${newChannel.nsfw}\`` }
        )
        .setTimestamp();

        channel_logs.send({ embeds: [Log] });
    }

    if(oldChannel.userLimit !== newChannel.userLimit) {
      const Log = new MessageEmbed()
        .setColor(channel_log_colour)
        .setTitle("__Channel Updated📺__")
        .setDescription(`${newChannel}'s user limit was **updated** <t:${happen}:R>`)
        .addFields(
          { name: "Old user limit", value: `\`${oldChannel.rateLimitPerUser ? oldChannel.rateLimitPerUser : "None"}\`` },
          { name: "New user limit", value: `\`${newChannel.rateLimitPerUser ? newChannel.rateLimitPerUser : "None"}\`` }
        )
        .setTimestamp();

        channel_logs.send({ embeds: [Log] });
    }

    if(oldChannel.bitrate !== newChannel.bitrate) {
      const Log = new MessageEmbed()
        .setColor(channel_log_colour)
        .setTitle("__Channel Updated📺__")
        .setDescription(`${newChannel}'s bitrate was **updated** <t:${happen}:R>`)
        .addFields(
          { name: "Old bitrate", value: `\`${oldChannel.bitrate}\`` },
          { name: "New bitrate", value: `\`${newChannel.bitrate}\`` }
        )
        .setTimestamp();

        channel_logs.send({ embeds: [Log] });
    }

    if(oldChannel.parentId !== newChannel.parentId) {
      const Log = new MessageEmbed()
        .setColor(channel_log_colour)
        .setTitle("__Channel Updated📺__")
        .setDescription(`${newChannel}'s category was **updated** <t:${happen}:R>`)
        .addFields(
          { name: "Old category", value: `\`${oldChannel.parent.name}\`` },
          { name: "New category", value: `\`${newChannel.parent.name}\`` }
        )
        .setTimestamp();

        channel_logs.send({ embeds: [Log] });
    }   
  },
};
