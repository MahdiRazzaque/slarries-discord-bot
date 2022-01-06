const { CommandInteraction, MessageEmbed, Message } = require("discord.js");

module.exports = {
    name: "poll",
    description: "Create a poll",
    usage: "/poll",
    permission: "ADMINISTRATOR",
    disabled: false,
    options: [
      {
        name: "question",
        description: "State the question for the poll",
        type: "STRING",
        required: true
      },
      {
        name: "yes-or-no",
        description: "Is this a yes or no poll.",
        type: "STRING",
        choices: [
          {
            name: "True",
            value: "true"
          },
          {
            name: "False",
            value: "false"
          },
        ],
        required: true
      },
      {
      name: "options",
      description: "State the options for the poll Option1^Option2^Option3",
      type: "STRING",
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

        const question = interaction.options.getString("question");
        let options = interaction.options.getString("options")
        const yOrNo = interaction.options.getString("yes-or-no");
        const gChannel = interaction.options.getChannel("channel") || interaction.channel;

        switch(yOrNo) {
          case "false":

            if(!options)
              return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("<a:animated_cross:925091847905366096> This type of poll requires options to be set.")], ephemeral: true})

            const splitOptions = [];
            const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
    
            options = options.split("^");
            options.forEach(e => {
                if(e.length > 0) {
                    splitOptions.push(e.trim())
                }
            }); 

            if (splitOptions.length > 9)
              return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("<a:animated_cross:925091847905366096> Polls can only have 9 options.")], ephemeral: true})

    

            let pollOptions = ` `
            
            for (let i = 0; i < splitOptions.length; i++) {
                pollOptions = pollOptions + (`\n\n ${emoji[i]} ${splitOptions[i]}`)
              }
    
              const pollEmbed = new MessageEmbed()
              .setColor("AQUA")
              .setTitle(`**${question}** 📊`)
              .setDescription(pollOptions)
              .setFooter("Please react with the an emoji based on your opinion.")
              .setTimestamp()
    
            const sendMessage = await client.channels.cache.get(gChannel.id).send({embeds: [pollEmbed]});
            for (let i = 0; i < splitOptions.length; i++) {
                sendMessage.react(`${emoji[i]}`);
              }    
            interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`<a:animated_tick:925091839030231071> The poll was successfully sent to ${gChannel}.`)],ephemeral: true})
            break;

          case "true":
            const pollEmbedYOrNo = new MessageEmbed()
            .setColor("AQUA")
            .setTitle(`**${question}** 📊`)
            .setFooter("Please react with the 👍,👎 or 🤷‍♂️ based on your opinion.")
            .setTimestamp()

            const sendMessageYOrNo = await client.channels.cache.get(gChannel.id).send({embeds: [pollEmbedYOrNo]});
            sendMessageYOrNo.react("👍")
            sendMessageYOrNo.react("👎")
            sendMessageYOrNo.react("🤷‍♂️")

            interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`<a:animated_tick:925091839030231071> The poll was successfully sent to ${gChannel}.`)],ephemeral: true})
            break;
        }       
    }
}