const { Client, MessageEmbed, Message, User, UserFlags } = require("discord.js");
const { guild_logs_id, guild_log_colour } = require("../../structures/config.json");

module.exports = {
  name: "userUpdate",
  disabled: false,
  /**
   * @param {User} oldUser
   * @param {User} newUser
   * @param {Client} client
   */
  async execute(oldUser, newUser, client) {

    const guild_logs = client.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    if (oldUser.username !== newUser.username) {
        const usernameChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("User Updated 🎭")
            .setTimestamp()
            .setDescription(`${newUser} **updated** their username <t:${happen}:R>.`)
            .addFields(
                { name: "Old username", value: `\`${oldUser.username}\`` },
                { name: "New username", value: `\`${newUser.username}\`` }
            )

        guild_logs.send({ embeds: [usernameChanged] });
    }

    if (oldUser.discriminator !== newUser.discriminator) {
        const discriminatorChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("User Updated 🎭")
            .setTimestamp()
            .setDescription(`${newUser} **updated** their discriminator <t:${happen}:R>.`)
            .addFields(
                { name: "Old discriminator", value: `\`${oldUser.discriminator}\`` },
                { name: "New discriminator", value: `\`${newUser.discriminator}\`` }
            )
  
        guild_logs.send({ embeds: [discriminatorChanged] });
      }

      if (!oldUser.flags.bitfield || !newUser.flags.bitfield) return;
      if (oldUser.flags.bitfield != newUser.flags.bitfield) {
        const newFlags = new UserFlags(newUser.flags.bitfield).toArray().slice(" ").map(e => `\`${e}\``).join(" ").toLowerCase().replaceAll("_", " ");
        const flagsChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("User Updated 🎭")
            .setTimestamp()
            .setDescription(`${newUser} **updated** their flags <t:${happen}:R>.`)
            .addField("New flags", newFlags || "\`No flags anymore\`")
  
        guild_logs.send({ embeds: [flagsChanged] });
      }

    if (oldUser.avatar !== newUser.avatar) {
        const avatarChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("User Updated 🎭")
            .setTimestamp()
            .setDescription(`${newUser} **updated** their avatar <t:${happen}:R>.`)
            .setImage(newUser.avatarURL({ dynamic: true }))
            .addFields(
                { name: "Old avatar", value: oldUser.avatar ? `${oldUser.avatarURL({ dynamic: true })}` : "\`No avatar before\`" },
                { name: "New avatar", value: newUser.avatar ? `${newUser.avatarURL({ dynamic: true })}` : "\`No new avatar\`" }
            )

        guild_logs.send({ embeds: [avatarChanged] });
    }

    if (oldUser.banner !== newUser.banner) {
        const bannerChanged = new MessageEmbed()
            .setColor(guild_log_colour)
            .setTitle("User Updated 🎭")
            .setTimestamp()
            .setDescription(`The user ${newUser} **updated** their banner <t:${happen}:R>.`)
            .setImage(newUser.bannerURL({ dynamic: true }))
            .addFields(
                { name: "Old banner", value: oldUser.banner ? `${oldUser.bannerURL({ dynamic: true })}` : "No banner before" },
                { name: "New banner", value: newUser.banner ? `${newUser.bannerURL({ dynamic: true })}` : "No new banner" }
            )
  
        guild_logs.send({ embeds: [bannerChanged] });
      }
  },
};
