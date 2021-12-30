const { CommandInteraction, MessageEmbed, Message } = require("discord.js");
const { poll_disabled } = require("../../structures/config.json")

module.exports = {
    name: "poll",
    description: "Create a poll",
    usage: "/poll",
    permission: "ADMINISTRATOR",
    options: [
      {
          name: "poll",
          description: "Describe the poll you want to make.",
          type: "STRING",
          required: true
      }, 
      {
        name: "channel",
        description: "Select a channel to send the message to.",
        type: "CHANNEL",
        channelTypes: ["GUILD_TEXT"],
      },
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        if(poll_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setDescription("<a:animated_cross:925091847905366096> **Command Disabled**")], ephemeral: true})};
        
        const { options } = interaction;

        const poll = options.getString("poll");
        const gChannel = options.getChannel("channel") || interaction.channel;

        const pollEmbed = new MessageEmbed()
            .setColor("AQUA")
            .setTitle("Poll 📊")
            .setDescription(poll)
            .setFooter("Please react with the 👍, 👎,🤷‍♂️based on your opinion.")
            .setTimestamp()

        const sendMessage = await client.channels.cache.get(gChannel.id).send({embeds: [pollEmbed]});
        sendMessage.react("👍")
        sendMessage.react("👎")
        sendMessage.react("🤷‍♂️")

        interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`<a:animated_tick:925091839030231071> The poll was successfully sent to ${gChannel}.`)],ephemeral: true})
    }
}