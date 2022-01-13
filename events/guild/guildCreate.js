const { Client, MessageEmbed, Message, Guild } = require("discord.js");

module.exports = {
  name: "guildCreate",
  /**
   * @param {Client} client
   * @param {Guild} guild
   */
  execute(guild, client) {
    const Log = new MessageEmbed()
    .setColor("GREEN")
    .setTitle("__Bot has joined a new guild__🔨")
    .addFields(
        {name: "Guild name", value: `${guild.name}`, inline: true},
        {name: "Guild ID", value: `${guild.id}`, inline: true},
        {name: "Members", value: `${guild.memberCount}`},
        {name: "Number of servers the bot is in", value: `${client.guilds.cache.size}`},
    )
    .setTimestamp();

    const guild_logs = client.channels.cache
    .get("927557693370155079")
    .send({ embeds: [Log] });
  },
};
