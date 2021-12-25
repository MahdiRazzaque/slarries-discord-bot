const { CommandInteraction, MessageEmbed } = require("discord.js");
const { clear_disabled, moderation_embed_colour } = require("../../structures/config.json");

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = {
  name: "clear",
  description: "Deletes a specified number of messages from a channel or a target.",
  usage: "/clear",
  permission: "MANAGE_MESSAGES",
  options: [
    {
      name: "amount",
      description:
        "Select the number of messages to delete from a channel or target.",
      type: "NUMBER",
      required: true,
    },
    {
      name: "target",
      description: "Select a target to clear their messages.",
      type: "USER",
      required: false,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    if (clear_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setTitle("**Command Disabled** ❌")], ephemeral: true})};
      
    const { channel, options } = interaction;

    const Amount = options.getNumber("amount");
    const Target = options.getMember("target");

    const Messages = await channel.messages.fetch();

    const Response = new MessageEmbed().setColor(moderation_embed_colour);

    if (Amount > 100 || Amount <= 0) {
      Response.setDescription(`Amount cannot exceed 100, and cannot be under 1.`);
      return interaction.reply({ embeds: [Response], ephemeral: true });
    }

    if (Target) {
      let i = 0;
      const filtered = [];
      (await Messages).filter((m) => {
        if (m.author.id === Target.id && Amount > i) {
          filtered.push(m);
          i++;
        }
      });

      await channel.bulkDelete(filtered, true).then((messages) => {
        Response.setDescription(`🧹 Cleared ${messages.size} from ${Target}.`);
        interaction.reply({ embeds: [Response], ephemeral: true });
      });
    } else {
      await channel.bulkDelete(Amount, true).then((messages) => {
        Response.setDescription(`🧹 Cleared ${messages.size} from this channel.`);
        interaction.reply({ embeds: [Response], ephemeral: true });
      });
    }
  },
};
