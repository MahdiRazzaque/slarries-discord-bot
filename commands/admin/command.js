const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const DB = require("../../structures/schemas/disabledCommandsDB");
const { admin_embed_colour } = require("../../structures/config.json")

module.exports = {
  name: "command",
  description: "Disable or enable a slash command.",
  usage: "/command",
  userPermissions: ["ADMINISTRATOR"],
  options: [
      {
        name: "disable",
        description: "Disable a slash command",
        type: "SUB_COMMAND",
        options: [{name: "command", description: "Name of the command you want to disable.", type: "STRING", required: true}]
      },
      {
        name: "enable",
        description: "Disable a slash command",
        type: "SUB_COMMAND",
        options: [{name: "command", description: "Name of the command you want to enable.", type: "STRING", required: true}]
      },
      {
        name: "list",
        description: "Get a list of all disabled commands.",
        type: "SUB_COMMAND",
      },
  ],
  /**
   * 
   * @param {CommandInteraction} interaction 
   * @param {Client} client 
   * @returns 
   */
  async execute(interaction, client)  {
    const cmd = interaction.options.getString("command");
    const derescommand = await client.commands.get(cmd);

    switch(interaction.options.getSubcommand()) {
        case "disable":

          if (!derescommand)
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The command \`\`${cmd}\`\` does not exist.`)], ephemeral: true})

          if (cmd === "command")
              return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You cannot disable the command \`\`/command\`\``)], ephemeral: true})
        
          DB.findOne({ GuildID: interaction.guild.id }, async (err, data) => {
          if (err) throw err;
          if (!data) 
              data = await DB.create({ GuildID: interaction.guild.id, Commands: []})
              
          if (data.Commands.includes(cmd))
              return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The command \`\`${cmd}\`\` has already been disabled.`)], ephemeral: true})
          
          data.Commands.push(cmd);
          await data.save();

          return interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} The command \`\`${cmd}\`\` has been disabled.`)], ephemeral: true}) 
          });
        break;

        case "enable":
      
          if (!derescommand)
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The command \`\`${cmd}\`\` does not exist.`)], ephemeral: true})
            
          DB.findOne({ GuildID: interaction.guild.id }, async (err, data) => {
              if (err) throw err;
              if (!data) 
                  await DB.create({ GuildID: interaction.guild.id, Commands: []})
              
              if (!data.Commands.includes(cmd))
                  return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} The command \`\`${cmd}\`\` is already enabled.`)], ephemeral: true})
              
              data.Commands.splice(data.Commands.indexOf(cmd), 1);
              await data.save();
          
            return interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`${client.emojisObj.animated_tick} The command \`\`${cmd}\`\` has been enabled.`)], ephemeral: true}) 
          });
        break;
        
        case "list":

          DB.findOne({ GuildID: interaction.guild.id }, async (err, data) => {
            if (err) throw err;
            if (!data) 
                await DB.create({ GuildID: interaction.guild.id, Commands: []})

            return interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setTitle("Disabled commands").setDescription(`${data.Commands.join(", ") || "None"}`)]})
          });

        break;
    }

  },
};
