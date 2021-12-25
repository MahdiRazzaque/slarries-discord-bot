const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const ms = require("ms");
const { giveaway_disabled, system_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "giveaway",
  description: "A complete giveaway system.",
  usage: "/giveaway",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "start",
      description: "Start a giveaway.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "duration",
          description: "Provide a duration for this giveaway (1m, 1h, 1d).",
          type: "STRING",
          required: true,
        },
        {
          name: "winners",
          description: "Select the amount of winners for this giveaway.",
          type: "INTEGER",
          required: true,
        },
        {
          name: "prize",
          description: "State the prize for this giveaway.",
          type: "STRING",
          required: true,
        },
        {
          name: "channel",
          description: "Select a channel to send the giveaway to.",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
        },
      ],
    },
    {
      name: "actions",
      description: "Options for giveaway.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "options",
          description: "Select an option.",
          type: "STRING",
          required: true,
          choices: [
            {
              name: "end",
              value: "end",
            },
            {
              name: "pause",
              value: "pause",
            },
            {
              name: "unpause",
              value: "unpause",
            },
            {
              name: "reroll",
              value: "reroll",
            },
            {
              name: "delete",
              value: "delete",
            },
          ],
        },
        {
          name: "message-id",
          description: "Prove the message id of the giveaway.",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    if (giveaway_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setTitle("**Command Disabled** ❌")], ephemeral: true})};
    
    const { options } = interaction;

    const Sub = options.getSubcommand();

    const errEmbed = new MessageEmbed().setColor("RED");

    const successEmbed = new MessageEmbed().setColor(system_embed_colour);

    switch (Sub) {
      case "start":
        {
          const gChannel =  options.getChannel("channel") || interaction.channel;
          const duration = options.getString("duration");
          const winnerCount = options.getInteger("winners");
          const prize = options.getString("prize");

          client.giveawaysManager.start(gChannel, {duration: ms(duration), winnerCount, prize,
              messages: {
                giveaway: "🎉**Giveaway Started**🎉",
                giveawayEnded: "🎊**Giveaway Ended**🎊",
                winMessage: "Congratulations, {winners}! You won **{this.prize}**!",
              },
            })
            .then(async () => {
              successEmbed.setDescription("Giveaway was successfully started. ✅");
              return interaction.reply({embeds: [successEmbed], ephemeral: true})})
            .catch((err) => {
              errEmbed.setDescription(`An error has occured \n\`${err}\``);
              return interaction.reply({embeds: [errEmbed], ephemeral: true});
            });
        }
        break;

      case "actions":
        {
          const choice = options.getString("options");
          const messageID = options.getString("message-id");

          const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageID);

          if (!giveaway) {errorEmbed.setDescription(`Unable to find a giveaway with the messageid: ${messageId} in this guild.`);
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });
          }

          switch (choice) {
            case "end":
              {
                const messageId = interaction.options.getString("message-id");
                client.giveawaysManager.end(messageId)
                  .then(() => {
                    successEmbed.setDescription("Giveaway has been ended. ✅");
                    return interaction.reply({embeds: [successEmbed], ephemeral: true})
                  })
                  .catch((err) => {
                    errEmbed.setDescription(`An error has occured ❌ \n\`${err}\``);
                    return interaction.reply({embeds: [errEmbed], ephemeral: true});
                  });
              }
              break;

            case "pause":
              {
                const messageId = interaction.options.getString("message-id");
                client.giveawaysManager.pause(messageId)
                  .then(() => {
                    successEmbed.setDescription("Giveaway has been paused. ✅");
                    return interaction.reply({embeds: [successEmbed], ephemeral: true,});
                  })
                  .catch((err) => {
                    errEmbed.setDescription(`An error has occured ❌ \n\`${err}\``);
                    return interaction.reply({embeds: [errEmbed], ephemeral: true})});
              }
              break;

            case "unpause":
              {
                const messageId = interaction.options.getString("message-id");
                client.giveawaysManager.unpause(messageId)
                  .then(() => {
                    successEmbed.setDescription("Giveaway has been unpaused. ✅");
                    return interaction.reply({embeds: [successEmbed], ephemeral: true});
                  })
                  .catch((err) => {
                    errEmbed.setDescription(`An error has occured \n\`${err}\``);
                    return interaction.reply({embeds: [errEmbed], ephemeral: true});
                  });
              }
              break;

            case "reroll":
              {
                const messageId = interaction.options.getString("message-id");
                client.giveawaysManager.reroll(messageId)
                  .then(() => {
                    successEmbed.setDescription("Giveaway has been rerolled. ✅");
                    return interaction.reply({embeds: [successEmbed], ephemeral: true});
                  })
                  .catch((err) => {
                    errEmbed.setDescription(`An error has occured ❌ \n\`${err}\``);
                    return interaction.reply({embeds: [errEmbed], ephemeral: true});
                  });
              }
              break;

            case "delete":
              {
                const messageId = interaction.options.getString("message-id");
                client.giveawaysManager.delete(messageId)
                  .then(() => {
                    successEmbed.setDescription("Giveaway has been deleted. ✅");
                    return interaction.reply({embeds: [successEmbed], ephemeral: true});
                  })
                  .catch((err) => {
                    errEmbed.setDescription(`An error has occured ❌ \n\`${err}\``);
                    return interaction.reply({embeds: [errEmbed], ephemeral: true});
                  });
              }
              break;
          }
        }
        break;

      default: {console.log("Error in giveaway command.");}
    }
  },
};
