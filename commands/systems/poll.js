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
        name: "type-of-poll",
        description: "What type of poll is this",
        type: "STRING",
        choices: [
          {
            name: "Yes or No Poll",
            value: "yes-no-poll"
          },
          {
            name: "Numbered Poll",
            value: "numbered-poll"
          },
          {
            name: "Custom Emoji Poll",
            value: "custom-emoji-poll"
          },
        ],
        required: true
      },
      {
      name: "options",
      description: "State the options for the poll. (Numbered-Option1^Option2) (Custom-Option1^Emoji1^^Option2^Emoji2)",
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
        const pollType = interaction.options.getString("type-of-poll");
        const gChannel = interaction.options.getChannel("channel") || interaction.channel;

        switch(pollType) {
          case "numbered-poll":

            if(!options)
              return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("<a:animated_cross:925091847905366096> This type of poll requires options to be set.")], ephemeral: true})

            if(options.includes("^^")) 
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> The poll was not sent as you used \`^^\` in your options (which is used in the custom emoji poll). Please try again using the right type-of-poll.`)],ephemeral: true})

            const splitOptions = [];
            const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
    
            options = options.split("^");
            options.forEach(e => {
                if(e.length > 0) {
                    splitOptions.push(e.trim())
                }
            }); 

            if (splitOptions.length > 9)
              return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("<a:animated_cross:925091847905366096> Numbered polls can only have 9 options.")], ephemeral: true})

            let pollOptions = ` `
            
            for (let i = 0; i < splitOptions.length; i++) {
                pollOptions = pollOptions + (`\n\n ${emoji[i]} ${splitOptions[i]}`)
              }
            
            if(pollOptions.length > 4096)
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> This poll is ${pollOptions.length - 4096} characters too long.`)], ephemeral: true})
    
              const pollEmbed = new MessageEmbed()
              .setColor("AQUA")
              .setTitle(`**${question}** 📊`)
              .setDescription(pollOptions)
              .setFooter({text: "Please react with the an emoji based on your opinion."})
              .setTimestamp()
    
            const sendMessage = await client.channels.cache.get(gChannel.id).send({embeds: [pollEmbed]});
            for (let i = 0; i < splitOptions.length; i++) {
                sendMessage.react(`${emoji[i]}`);
              }
            
            return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`<a:animated_tick:925091839030231071> The poll was successfully sent to ${gChannel}.`)],ephemeral: true})
            break;

          case "yes-no-poll":
            const pollEmbedYOrNo = new MessageEmbed()
            .setColor("AQUA")
            .setTitle(`**${question}** 📊`)
            .setFooter({text: "Please react with the 👍,👎 or 🤷‍♂️ based on your opinion."})
            .setTimestamp()

            const sendMessageYOrNo = await client.channels.cache.get(gChannel.id).send({embeds: [pollEmbedYOrNo]});
            sendMessageYOrNo.react("👍")
            sendMessageYOrNo.react("👎")
            sendMessageYOrNo.react("🤷‍♂️")

            if(options) {
              return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`<a:animated_tick:925091839030231071> The poll was successfully sent to ${gChannel}. \n*Since this a y/n poll, the options you provided were ignored.*`)],ephemeral: true})
            } else {
              return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`<a:animated_tick:925091839030231071> The poll was successfully sent to ${gChannel}.`)],ephemeral: true})
            }            
            break;
          case "custom-emoji-poll":
            if(!options)
              return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("<a:animated_cross:925091847905366096> This type of poll requires options to be set.")], ephemeral: true})

            const customSplitOptions = [];
            const optionNames = [];
            const customEmojis = [];

            options = options.split("^^");
            options.forEach(e => {
                if(e.length > 0) {
                  customSplitOptions.push(e.trim())
                }
            });

            for (let i = 0; i < customSplitOptions.length; i++) {
              var split = customSplitOptions[i].split("^")
              optionNames.push(split[0])
              customEmojis.push(split[1])
            }

            if (optionNames.length > customEmojis.length) {
              return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("<a:animated_cross:925091847905366096> You didn't supply a valid number of emojis.")], ephemeral: true})
            } else if (optionNames.length < customEmojis.length) {
              return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("<a:animated_cross:925091847905366096> You didn't supply a valid number of options.")], ephemeral: true})
            }
              
            let custompollOptions = ` `

            for (let i = 0; i < optionNames.length; i++) {
              custompollOptions = custompollOptions + (`\n\n ${customEmojis[i]} ${optionNames[i]}`)
            }

            if(custompollOptions.length > 4096)
              return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> This poll is ${custompollOptions.length - 4096} characters too long.`)], ephemeral: true})

            const customPollEmbed = new MessageEmbed()
            .setColor("AQUA")
            .setTitle(`**${question}** 📊`)
            .setDescription(custompollOptions)
            .setFooter({text: "Please react with the an emoji based on your opinion."})
            .setTimestamp()
  
          const sendMessageCustomEmojis = await client.channels.cache.get(gChannel.id).send({embeds: [customPollEmbed]});
          for (let i = 0; i < optionNames.length; i++) {
            try {
              await sendMessageCustomEmojis.react(`${customEmojis[i]}`);
            } catch (error) {
              sendMessageCustomEmojis.delete()
              return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`<a:animated_cross:925091847905366096> The poll was deleted as the emojis you provided were invalid. \n\nOptions: ${optionNames.map(e => e).join(", ")} \nEmojis: ${customEmojis.map(e => e).join(", ")}`)],ephemeral: true})
            } 
            }  
          
          return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`<a:animated_tick:925091839030231071> The poll was successfully sent to ${gChannel}.`)],ephemeral: true})
          break;
        }       
    }
}