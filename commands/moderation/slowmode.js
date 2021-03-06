const { MessageEmbed, CommandInteraction } = require("discord.js");
const ms = require("ms");
const { moderation_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "slowmode",
  description: "Slows down the rate at which messages can be sent.",
  usage: "/slowmode",
  userPermissions: ["MANAGE_MESSAGES"],
  disabled: false,
  options: [
    {
      name: "rate",
      description:
        "Provide the rate at which the user can send a new message, e.g 5s, 1m, 30m, etc.",
      type: "STRING",
      required: false,
    },
    {
      name: "duration",
      description:
        "Provide a duration for the slow mode, e.g 5s, 1m, 30m, etc., after which it will disable itself.",
      type: "STRING",
      required: false,
    },
    {
      name: "reason",
      description: "Provide a reason for why you activated slow mode.",
      type: "STRING",
      required: false,
    },
  ],
  async execute(interaction, client) {
    
    let message;
    const { channel, options } = interaction;
    const minRate = ms("5s");
    const maxRate = ms("6h");
    const minDuration = ms("10s");
    const rate =
      options.getString("rate") && ms(options.getString("rate"))
        ? ms(options.getString("rate"))
        : 0;
    const duration =
      options.getString("duration") && ms(options.getString("duration"))
        ? ms(options.getString("duration"))
        : 0;
    const reason = options.getString("reason") || "None provided";
    const description = duration
      ? `${client.emojisObj.animated_tick} Slow mode has been enabled with a rate of ${ms(rate, {
          long: true,
        })} for ${ms(duration, { long: true })}`
      : `${client.emojisObj.animated_tick} Slow mode has been enabled with a rate of ${ms(rate, { long: true })}`;
    const response = new MessageEmbed()
      .setTitle("🐌 Slow mode 🐌")
      .setColor(moderation_embed_colour)
      .setDescription(`${description}. **Reason:** ${reason}.`)
      .addField("**Reason**", reason)
      .setTimestamp();
    if (!rate) {
      channel.rateLimitPerUser
        ? response.setDescription(`${client.emojisObj.animated_tick} Slow mode has been disabled.`)
        : response.setDescription(
            `${client.emojisObj.animated_tick} Slow mode has been enabled with a rate of ${ms(minRate, {
              long: true,
            })}.`
          );
      channel.rateLimitPerUser
        ? channel.setRateLimitPerUser(0)
        : channel.setRateLimitPerUser(5);
      message = await interaction.reply({
        embeds: [response],
        fetchReply: true,
      });
      return setTimeout(() => message.delete().catch(() => {}), 7000);
    }

    if (rate < minRate || rate > maxRate) {
      response.setDescription(
        `${client.emojisObj.animated_cross} Rate must be between ${ms(minRate, { long: true })} and ${ms(maxRate, {
          long: true,
        })}. The rate can be supplied like so: *10s, 1m, 2h*, etc., or alternatively in milliseconds.`
      );
      return interaction.reply({
        embeds: [response],
        fetchReply: true,
        ephemeral: true,
      });
    }

    if (duration && duration < minDuration) {
      response.setDescription(
        `${client.emojisObj.animated_cross} Duration must be at least ${ms(minDuration, {
          long: true,
        })}. The duration can be supplied like so: *10s, 1m, 2h*, etc., or alternatively in milliseconds.`
      );
      return interaction.reply({
        embeds: [response],
        fetchReply: true,
        ephemeral: true,
      });
    }

    channel.setRateLimitPerUser(rate / 1000, reason);
    message = await interaction.reply({ embeds: [response], fetchReply: true });
    setTimeout(() => message.delete().catch(() => {}), 7000);

    if (duration)
      setTimeout(async () => channel.setRateLimitPerUser(0), duration);
  },
};
