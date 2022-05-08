const { Client, MessageEmbed, Message, Permissions, GuildScheduledEvent } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "guildScheduledEventUserAdd",
  disabled: false,
  /**
   * @param {GuildScheduledEvent} role
   * @param {Client} client
   */
  async execute(guildScheduledEvent, client) {

    const guild_logs = guildScheduledEvent.guild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    if(!log) return;

    if(!log.action == "GUILD_SCHEDULED_EVENT_CREATE") return;
    
    const guildScheduledEventCreate = new MessageEmbed()
      .setColor(guild_log_colour)
      .setTitle("A User Subscribed To An Event 📅")
      .setDescription(`The user \`${user.tag}\` subscribed to the event ${guildScheduledEvent.name}`)

    guild_logs.send({ embeds: [guildScheduledEventCreate] });
  },
};
