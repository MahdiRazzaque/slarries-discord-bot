const { Client, CommandInteraction, MessageEmbed, Collection } = require("discord.js");
const { owners, botOwners, command_logs_id, botCommandChannels } = require("../../structures/config.json");
const toDoListDB = require("../../structures/schemas/toDoListDB");
const DB = require("../../structures/schemas/disabledCommandsDB")

module.exports = {
  name: "interactionCreate",
  disabled: false,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    //Maintenance check
    if (client.maintenance && interaction.user.id != "381791690454859778") {
      const Response = new MessageEmbed()
        .setTitle("👷‍♂️ MAINTENANCE 👷‍♂️")
        .setDescription("Sorry the bot will be back shortly when everything is working correctly.")
        .setColor("RED");

      return interaction.reply({ embeds: [Response], ephemeral: true });
    }

    if (interaction.isCommand() || interaction.isContextMenu()) {
      const command = client.commands.get(interaction.commandName);
      if (!command)
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("🛑 An error has occured whilst running this command")]}) && client.commands.delete(interaction.commandName);

      if(interaction.commandName != "to-do-list") {
        const toDoList = toDoListDB.findOne({ChannelID: interaction.channel.id})
        if(toDoList.ChannelID == interaction.channel.id)
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("You can only use `/to-do-list` commands in this channel.")], ephemeral: true})
      }

      //Bot command channel only check
      if(command.botCommandChannelOnly == true && !owners.includes(interaction.member.id) && !botOwners.includes(interaction.member.id)) {
        if(!botCommandChannels.includes(interaction.channelId)) {
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} **This command (/${command.name}) can only be used in bot command channels.**`).addField("Bot command channels", `<#${botCommandChannels.map((c) => c).join(">, <#")}>`)], ephemeral: true})
        }
      }

      //Guild based command disabling
      const data = await DB.findOne({ GuildID: interaction.guild.id })

      if (!data) {
        await DB.create({ GuildID: interaction.guild.id, Commands: []})
      } else {
        if (data.Commands.includes(interaction.commandName))
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} **This command (/${command.name}) is currently disabled.**`)]})
      }
      
      //Hardcoded command disabled
      if(command.disabled == true) {
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} **This command (/${command.name}) is currently harcoded disabled.**`)]})
      }

      //Guild owners only commands check
      if(command.ownerOnly == true) {
        if(!owners.includes(interaction.member.id)) {
          const command_logs = client.channels.cache.get(command_logs_id).send({embeds: [new MessageEmbed().setColor("RED").setTitle("Command misuse").setDescription(`${client.emojisObj.animated_cross} ${interaction.member} tried to use a owner only command in ${interaction.channel}.`).addField("Command", `/${command.name}`).setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, size: 512 })}).setFooter({text: `ID| ${interaction.user.id}`})]})
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} **This command (/${command.name}) can only be used by the owners of this server**`)]})  
        }
      }
      
      //Bot owner only command check
      if(command.botOwnerOnly == true) {
        if(!botOwners.includes(interaction.member.id)) {
          const command_logs = client.channels.cache.get(command_logs_id).send({embeds: [new MessageEmbed().setColor("RED").setTitle("Command misuse").setDescription(`${client.emojisObj.animated_cross} ${interaction.member} tried to use a bot owner only command in ${interaction.channel}.`).addField("Command", `/${command.name}`).setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, size: 512 })}).setFooter({text: `ID| ${interaction.user.id}`})]})
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} **This command (/${command.name}) can only be used by the owners of this bot.**`)]})  
        }
      }

      //Roles check
      if(command.roles && command.roles.length > 0) {
        for (var i = 0; i < command.roles.length; i++) {
          if (!interaction.member.roles.cache.has(command.roles[i])) {
            continue;
          } 
          if (interaction.member.roles.cache.has(command.roles[i])) {
            var valid = true;
        }
      }
      if(!valid)
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} **To use this command (/${command.name}), you need one of the following roles:\n<@&${command.roles.map((r) => r).join(">, <@&")}>**`)]});
      }

      //Whitelist check
      if(command.whitelist && command.whitelist.length > 0 && !owners.includes(interaction.member.id) && !botOwners.includes(interaction.member.id)) {
        if (!command.whitelist.includes(interaction.member.id)) {
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross}  **To use this command (/${command.name}), you need to be part of the whitlisted members.**`).addField("Whitelisted Members", `<@${command.whitelist.map((m)=> m).join(">, <@")}>`)]})
        }
      }

      //Cooldowns
      const { cooldowns } = client;
      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
      }
  
      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 1) * 1000;
  
      if (timestamps.has(interaction.member.id)) {
        const expirationTime = timestamps.get(interaction.member.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          const timeLeftEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${client.emojisObj.animated_cross} Please wait another ${timeLeft.toFixed( 1 )} more seconds before using this command again`);
          return interaction.reply({embeds: [timeLeftEmbed], ephemeral: true})
        }
      }
  
      timestamps.set(interaction.member.id, now);
      setTimeout(() => timestamps.delete(interaction.member.id), cooldownAmount);

      //Executing command
      const cmd = client.commands.get(interaction.commandName);

      command.execute(interaction, client);
    }
  },
};