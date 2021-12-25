const { MessageEmbed, Message } = require("discord.js");
const { send_embed_disabled, admin_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "send-embed",
  description: "Send a embed to a specific channel.",
  usage: "/send-embed",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "title",
      description: "Embed Title",
      type: "STRING",
    },
    {
      name: "description",
      description: "Embed Description",
      type: "STRING",
    },
    {
      name: "colour",
      description: "Embed colour",
      type: "STRING",
      choices: [
        {
          name: "Aqua",
          value: "AQUA",
        },
        {
          name: "Dark_Aqua",
          value: "DARK_AQUA",
        },
        {
          name: "Green",
          value: "GREEN",
        },
        {
          name: "Dark_Green",
          value: "DARK_GREEN",
        },
        {
          name: "Blue",
          value: "BLUE",
        },
        {
          name: "Dark_Blue",
          value: "DARK_BLUE",
        },
        {
          name: "Purple",
          value: "PURPLE",
        },
        {
          name: "Dark_Purple",
          value: "DARK_PURPLE",
        },
        {
          name: "Luminous_Vivid_Pink",
          value: "LUMINOUS_VIVID_PINK",
        },
        {
          name: "Dark_Vivid_Pink",
          value: "DARK_VIVID_PINK",
        },
        {
          name: "Gold",
          value: "GOLD",
        },
        {
          name: "Orange",
          value: "ORANGE",
        },
        {
          name: "Dark_Orange",
          value: "DARK_ORANGE",
        },
        {
          name: "Red",
          value: "RED",
        },
        {
          name: "Dark_Red",
          value: "DARK_RED",
        },
        {
          name: "Grey",
          value: "GREY",
        },
        {
          name: "Dark_Grey",
          value: "DARK_GREY",
        },
        {
          name: "Navy",
          value: "NAVY",
        },
        {
          name: "Yellow",
          value: "YELLOW",
        },
        {
          name: "White",
          value: "WHITE",
        },
        {
          name: "Blurple",
          value: "BLURPLE",
        },
        {
          name: "Greyple",
          value: "GREYPLE",
        },
        {
          name: "Fuschia",
          value: "FUSCHIA",
        },
        {
          name: "Black",
          value: "BLACK",
        },
        {
          name: "Random",
          value: "RANDOM",
        },
      ],
    },
    {
      name: "footer",
      description: "Embed Footer",
      type: "STRING",
    },
    {
      name: "field1",
      description: "Embed Field 1",
      type: "STRING",
    },
    {
      name: "field1name",
      description: "Embed Field 1 Name",
      type: "STRING",
    },
    {
      name: "field2",
      description: "Embed Field 2",
      type: "STRING",
    },
    {
      name: "field2name",
      description: "Embed Field 2 Name",
      type: "STRING",
    },
    {
      name: "field3",
      description: "Embed Field 3",
      type: "STRING",
    },
    {
      name: "field3name",
      description: "Embed Field 3 Name",
      type: "STRING",
    },
    {
      name: "field4",
      description: "Embed Field 4",
      type: "STRING",
    },
    {
      name: "field4name",
      description: "Embed Field 4 Name",
      type: "STRING",
    },
    {
      name: "field5",
      description: "Embed Field 5",
      type: "STRING",
    },
    {
      name: "field5name",
      description: "Embed Field 5 Name",
      type: "STRING",
    },
    {
      name: "author",
      description: "Embed author",
      type: "STRING",
    },
    {
      name: "channel",
      description: "Select a channel to send the embed to.",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (send_embed_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setTitle("**Command Disabled** ❌")], ephemeral: true})};
    
    const { options } = interaction;

    const title = options.getString("title") || "none";
    const description = options.getString("description") || "none";
    const colour = options.getString("colour") || "none";
    const footer = options.getString("footer") || "none";
    const field1 = options.getString("field1") || "none";
    const field1name = options.getString("field1name") || "none";
    const field2 = options.getString("field2") || "none";
    const field2name = options.getString("field2name") || "none";
    const field3 = options.getString("field3") || "none";
    const field3name = options.getString("field3name") || "none";
    const field4 = options.getString("field4") || "none";
    const field4name = options.getString("field4name") || "none";
    const field5 = options.getString("field5") || "none";
    const field5name = options.getString("field5name") || "none";
    const author = options.getString("author") || "none";
    const gChannel = options.getChannel("channel") || interaction.channel;

    const embed = new MessageEmbed();

    if (title != "none") {embed.setTitle(title)}

    if (description != "none") {embed.setDescription(description)}

    if (colour != "none") {embed.setColor(colour)}

    if (footer != "none") {embed.setFooter(footer)}

    if (field1 != "none") {embed.addField(field1name, field1, true)}
    if (field2 != "none") {embed.addField(field2name, field2, true)}
    if (field3 != "none") {embed.addField(field3name, field3, true)}
    if (field4 != "none") {embed.addField(field4name, field4, true)}
    if (field5 != "none") {embed.addField(field5name, field5, true)}

    if (author != "none") {embed.setAuthor(author)}

    if (title === "none" && description === "none" && footer === "none" && field1 === "none" && field2 === "none" && field3 === "none" && field4 === "none" && field5 === "none" && author === "none") {
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("Please enter at least one value to send! ❌"),],ephemeral: true,})}

    const err = new MessageEmbed().setTitle("Error ❌").setColor("RED");

    var valid = true;

    if (field1name === "none" && field1 != "none") {
      err.addField("field1", "field1 is missing a name.");
      valid = false;
    }
    if (field2name === "none" && field2 != "none") {
      err.addField("field2", "field2 is missing a name.");
      valid = false;
    }
    if (field3name === "none" && field3 != "none") {
      err.addField("field3", "field3 is missing a name.");
      valid = false;
    }
    if (field4name === "none" && field4 != "none") {
      err.addField("field4", "field4 is missing a name.");
      valid = false;
    }
    if (field5name === "none" && field5 != "none") {
      err.addField("field5", "field5 is missing a name.");
      valid = false;
    }

    if (field1 === "none" && field1name != "none") {
      err.addField("field1", "field1 is missing a value.");
      valid = false;
    }
    if (field2 === "none" && field2name != "none") {
      err.addField("field2", "field2 is missing a value.");
      valid = false;
    }
    if (field3 === "none" && field3name != "none") {
      err.addField("field3", "field3 is missing a value.");
      valid = false;
    }
    if (field4 === "none" && field4name != "none") {
      err.addField("field4", "field4 is missing a value.");
      valid = false;
    }
    if (field5 === "none" && field5name != "none") {
      err.addField("field5", "field5 is missing a value.");
      valid = false;
    }

    if (valid) {interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`The embed was successfully sent to ${gChannel} ✅`)], ephemeral: true});
      const message = client.channels.cache.get(gChannel.id);

      message.send({ embeds: [embed] });
    } else {
      interaction.reply({ embeds: [err], ephemeral: true });
    }
  },
};
