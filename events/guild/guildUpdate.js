const { Client, MessageEmbed, GuildBan } = require("discord.js");
const { guild_log_colour, guild_logs_id } = require("../../structures/config.json");
const ms = require("ms");

module.exports = {
  name: "guildUpdate",
  disabled: false,
  /**
   * @param {Guild} oldGuild
   * @param {Guild} newGuild
   */
  async execute(oldGuild, newGuild, client) {

    const logs = await oldGuild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first();

    if(!log) return;

    const guild_logs = oldGuild.channels.cache.get(guild_logs_id)
    let happen = Math.floor(new Date().getTime()/1000.0)

    const guildUpdate = new MessageEmbed()
      .setColor(guild_log_colour)
      .setTitle("Guild Updated 🗄️")
      .setTimestamp();

    if (log.action == "GUILD_UPDATE") { 
        if (oldGuild.name !== newGuild.name) {
            guildUpdate.setDescription(`The name of \`${newGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old name", value: `\`${oldGuild.name}\`` },
                { name: "New name", value: `\`${newGuild.name}\`` }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }
        if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
            guildUpdate.setDescription(`The AFK channel of \`${newGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old AFK channel", value: oldGuild.afkChannelId ? `\`${oldGuild.afkChannel.name}\`` : "\`No AFK channel before\`" },
                { name: "New AFK channel", value: newGuild.afkChannelId ? `\`${newGuild.afkChannel.name}\`` : "\`No new AFK channel\`" }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }
        if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
            guildUpdate.setDescription(`The AFK timeout of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old AFK timeout", value: `\`${ms(oldGuild.afkTimeout * 1000)}\`` },
                { name: "New AFK timeout", value: `\`${ms(newGuild.afkTimeout * 1000)}\`` }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.banner !== newGuild.banner) {
            guildUpdate.setDescription(`The banner of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.setImage(newGuild.bannerURL({ dynamic: true }))
            guildUpdate.addFields(
                { name: "Old banner", value: oldGuild.banner ? `${oldGuild.bannerURL({ dynamic: true })}` : "\`No banner before\`" },
                { name: "New banner", value: newGuild.banner ? `${newGuild.bannerURL({ dynamic: true })}` : "\`No new banner\`" }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications) {
            guildUpdate.setDescription(`The default message notification of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old default message notification", value: `\`${oldGuild.defaultMessageNotifications.toLowerCase().replace("_", " ")}\`` },
                { name: "New default message notification", value: `\`${newGuild.defaultMessageNotifications.toLowerCase().replace("_", " ")}\`` }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.description !== newGuild.description) {
            guildUpdate.setDescription(`The description of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old description", value: oldGuild.description ? `\`${oldGuild.description}\`` : "\`No description before\`" },
                { name: "New description", value: newGuild.description ? `\`${newGuild.description}\`` : "\`No new description\`" }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.discoverySplash !== newGuild.discoverySplash) {
            guildUpdate.setDescription(`The discovery splash image of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.setImage(newGuild.discoverySplashURL())
            guildUpdate.addFields(
                { name: "Old discovery splash image", value: oldGuild.discoverySplash ? `${oldGuild.discoverySplashURL()}` : "\`No discovery splash image before\`" },
                { name: "New discovery splash image", value: newGuild.discoverySplash ? `${newGuild.discoverySplashURL()}` : "\`No new discovery splash image\`" }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) {
            guildUpdate.setDescription(`The explicit content filter of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old explicit content filter", value: `\`${oldGuild.explicitContentFilter.toLowerCase().replaceAll("_", " ")}\`` },
                { name: "New explicit content filter", value: `\`${newGuild.explicitContentFilter.toLowerCase().replaceAll("_", " ")}\`` }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.icon !== newGuild.icon) { 
            guildUpdate.setDescription(`The icon of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.setImage(newGuild.iconURL({ dynamic: true }))
            guildUpdate.addFields(
                { name: "Old icon", value: oldGuild.icon ? `${oldGuild.iconURL({ dynamic: true })}` : "\`No icon before\`" },
                { name: "New icon", value: newGuild.icon ? `${newGuild.iconURL({ dynamic: true })}` : "\`No new icon\`" }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.mfaLevel !== newGuild.mfaLevel) {
            guildUpdate.setDescription(`The MFA level of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old MFA level", value: `\`${oldGuild.mfaLevel.toLowerCase().replaceAll("_", " ")}\`` },
                { name: "New MFA level", value: `\`${newGuild.mfaLevel.toLowerCase().replaceAll("_", " ")}\`` }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.nsfwLevel !== newGuild.nsfwLevel) { 
            guildUpdate.setDescription(`The NSFW level of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old NSFW level", value: `\`${oldGuild.nsfwLevel.toLowerCase().replaceAll("_", " ")}\`` },
                { name: "New NSFW level", value: `\`${newGuild.nsfwLevel.toLowerCase().replaceAll("_", " ")}\`` }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.ownerId !== newGuild.ownerId) {
            guildUpdate.setDescription(`The owner of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old owner", value: `<@!${oldGuild.ownerId}>` },
                { name: "New owner", value: `<@!${newGuild.ownerId}>` }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.preferredLocale !== newGuild.preferredLocale) {
            guildUpdate.setDescription(`The preferred locale of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old preferred locale", value: oldGuild.preferredLocale ? `\`${oldGuild.preferredLocale.toLowerCase()}\`` : "\`No preferred locale before\`" },
                { name: "New preferred locale", value: newGuild.preferredLocale ? `\`${newGuild.preferredLocale.toLowerCase()}\`` : "\`No new preferred locale\`" }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (!oldGuild.premiumProgressBarEnabled && newGuild.premiumProgressBarEnabled) {
            guildUpdate.setDescription(`The guild \`${oldGuild.name}\` now has it's nitro progress bar enabled`)
            guild_logs.send({ embeds: [guildUpdate] });
        } else if (oldGuild.premiumProgressBarEnabled && !newGuild.premiumProgressBarEnabled) {
            guildUpdate.setDescription(`The guild \`${oldGuild.name}\` now has it's nitro progress bar diabled.`)
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.publicUpdatesChannelId !== newGuild.publicUpdatesChannelId) {
            guildUpdate.setDescription(`The public updates channel of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old public updates channel", value: oldGuild.publicUpdatesChannelId ? `\`${oldGuild.publicUpdatesChannel.name}\`` : "\`No public updates channel before\`" },
                { name: "New public updates channel", value: newGuild.publicUpdatesChannelId ? `\`${newGuild.publicUpdatesChannel.name}\`` : "`\No new public updates channel\`" }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.rulesChannelId !== newGuild.rulesChannelId) {
            guildUpdate.setDescription(`The rules channel of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old rules channel", value: oldGuild.rulesChannelId ? `\`${oldGuild.rulesChannel.name}\`` : "\`No rules channel before\`" },
                { name: "New rules channel", value: newGuild.rulesChannelId ? `\`${newGuild.rulesChannel.name}\`` : "\`No new rules channel\`" }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.systemChannelId !== newGuild.systemChannelId) {
            guildUpdate.setDescription(`The system channel of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old system channel", value: oldGuild.systemChannelId ? `\`${oldGuild.systemChannel.name}\`` : "\`No system channel before\`" },
                { name: "New system channel", value: newGuild.systemChannelId ? `\`${newGuild.systemChannel.name}\`` : "\`No new system channel\`" }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.systemChannelFlags.bitfield !== newGuild.systemChannelFlags.bitfield) {
            const pp = new SystemChannelFlags(newGuild.systemChannelFlags.bitfield).toArray().slice(" ").map(e =`\`${e}\``).join(" ").toLowerCase().replaceAll("_", " ");
            
            guildUpdate.setDescription(`The system flags of \`${oldGuild.name}\` have been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addField("Deactivated", pp || "All are now activated")

            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
            guildUpdate.setDescription(`The vanity URL of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old vanity URL", value: oldGuild.vanityURLCode ? `\`${oldGuild.vanityURLCode}\`` : "\`No vanity URL before\`" },
                { name: "New vanity URL", value: newGuild.vanityURLCode ? `\`${newGuild.vanityURLCode}\`` : "\`No new vanity URL\`" }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
            guildUpdate.setDescription(`The verification level of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old verification level", value: `\`${oldGuild.verificationLevel.toLowerCase().replace("_", " ")}\`` },
                { name: "New verification level", value: `\`${newGuild.verificationLevel.toLowerCase().replace("_", " ")}\`` }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (!oldGuild.verified && newGuild.verified) { 
            guildUpdate.setDescription(`The guild \`${oldGuild.name}\` was verified <t:${happen}:R>.`)
            guild_logs.send({ embeds: [guildUpdate] });
        } else if (oldGuild.verified && !newGuild.verified) {
            guildUpdate.setDescription(`The guild \`${oldGuild.name}\` was unverified <t:${happen}:R>.`)
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (!oldGuild.widgetEnabled && newGuild.widgetEnabled) {
            guildUpdate.setDescription(`The guild \`${oldGuild.name}\` widget was enabled <t:${happen}:R>.`)
            guild_logs.send({ embeds: [guildUpdate] });
        } else if (oldGuild.widgetEnabled && !newGuild.widgetEnabled) {
            guildUpdate.setDescription(`The guild \`${oldGuild.name}\` widget was disabled <t:${happen}:R>.`)
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.widgetChannelId !== newGuild.widgetChannelId) {
            guildUpdate.setDescription(`The widget channel of \`${oldGuild.name}\` has been **updated** by \`${log.executor.tag}\` <t:${happen}:R>.`)
            guildUpdate.addFields(
                { name: "Old widget channel", value: oldGuild.widgetChannelId ? `\`${oldGuild.widgetChannel.name}\`` : "\`No widget channel before\`" },
                { name: "New wiget channel", value: newGuild.widgetChannelId ? `\`${newGuild.widgetChannel.name}\`` : "\`No new widget channel\`" }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }
    } else {

        if (!oldGuild.partnered && newGuild.partnered) {
            guildUpdate.setDescription(`The guild \`${oldGuild.name}\` is now partnered with Discord.`)
            guild_logs.send({ embeds: [guildUpdate] });
        } else if (oldGuild.partnered && !newGuild.partnered) {
            guildUpdate.setDescription(`The guild \`${oldGuild.name}\` is not partnered with Discord anymore`)
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.premiumSubscriptionCount !== newGuild.premiumSubscriptionCount) {
            if (oldGuild.premiumSubscriptionCount < newGuild.premiumSubscriptionCount) { 
                guildUpdate.setDescription(`Someone started boosting \`${oldGuild.name}\` <t:${happen}:R>.`)
            } else if (oldGuild.premiumSubscriptionCount > newGuild.premiumSubscriptionCount) {
                guildUpdate.setDescription(`Someone stopped boosting \`${oldGuild.name}\` <t:${happen}:R>.`)
            }
            guild_logs.send({ embeds: [guildUpdate] });
        }

        if (oldGuild.premiumTier !== newGuild.premiumTier) {
            guildUpdate.setDescription(`The premium tier of \`${oldGuild.name}\` has been **updated**`)
            guildUpdate.addFields(
                { name: "Old premium tier", value: `\`${oldGuild.premiumTier.toLowerCase().replaceAll("_", " ")}\`` },
                { name: "New premium tier", value: `\`${newGuild.nsfwLevel.toLowerCase().replaceAll("_", " ")}\`` }
            )
            guild_logs.send({ embeds: [guildUpdate] });
        }
    }
  },
};
