const { Client, Message, Collection, MessageEmbed } = require("discord.js");
const { Prefix } = require("../../structures/config.json");
const { owners, botOwners, command_logs_id, botCommandChannels } = require("../../structures/config.json")
const DB = require("../../structures/schemas/disabledCommandsDB")

module.exports = {
  name: "messageCreate",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  async execute(message, client) {
    if (!message.content.startsWith(Prefix) || message.author.bot) return;

    const args = message.content.slice(Prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLocaleLowerCase();
    const command =
      client.prefixcommands.get(commandName) ||
      client.prefixcommands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    //Maintenance check
    if (client.maintenance && message.author.id != "381791690454859778") {
        const Response = new MessageEmbed()
            .setTitle("👷‍♂️ MAINTENANCE 👷‍♂️")
            .setDescription("Sorry the bot will be back shortly when everything is working correctly.")
            .setColor("RED");
    
        return message.reply({ embeds: [Response], ephemeral: true });
    }

    if(message.guild) {
      //Bot command channelonly check
      if(command.botCommandChannelOnly == true && !owners.includes(message.author.id) && !botOwners.includes(message.author.id)) {
        if(!botCommandChannels.includes(message.channel.id)) {
            return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} **This command (${Prefix}${command.name}) can only be used in bot command channels.**`).addField("Bot command channels", `<#${botCommandChannels.map((c) => c).join(">, <#")}>`)]}).then((sent) => {setTimeout(() => {sent.delete(); message.delete()}, 2500)})}
      }

      //Guild based command disabling
      const data = await DB.findOne({ GuildID: message.guild.id })

      if (!data) {
      await DB.create({ GuildID: message.guild.id, Commands: []})
      } else {
      if (data.Commands.includes(commandName))
      return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} **This command (/${command.name}) is currently disabled**`)], ephemeral: true})
      }

      if (command.permission) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permission)) {
          const NoPermsEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${client.emojisObj.animated_cross} You need the ${command.permission} to use this command`);
          return message.reply({ embeds: [NoPermsEmbed] })
        }
      }

      //Roles check
      if(command.roles && command.roles.length > 0) {
        for (var i = 0; i < command.roles.length; i++) {
            if (!message.member.roles.cache.has(command.roles[i])) {
                continue;
            } 
            if (message.member.roles.cache.has(command.roles[i])) {
                var valid = true;
          }
      }
      if(!valid)
          return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} **To use this command (${Prefix}${command.name}), you need one of the following roles:\n<@&${command.roles.map((r) => r).join(">, <@&")}>**`)]});
      }
    }

    //Hardcoded command disabled
    if(command.disabled == true) 
        return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} **This command (${Prefix}${command.name}) is currently hardcoded disabled.**`)]})


    //Guild owners only commands check
    if(command.ownerOnly == true) {
        if(!owners.includes(message.author.id)) {
            const command_logs = client.channels.cache.get(command_logs_id).send({embeds: [new MessageEmbed().setColor("RED").setTitle("Command misuse").setDescription(`${client.emojisObj.animated_cross} ${message.author} tried to use a owner only prefix command in ${message.channel}.`).addField("Command", `/${command.name}`).setAuthor({name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 512 })}).setFooter({text: `ID| ${message.author.id}`})]})
            return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} **This command (${Prefix}${command.name}) can only be used by the owners of this server**`)]})  
        }
    }
      
    //Bot owner only command check
    if(command.botOwnerOnly == true) {
        if(!botOwners.includes(message.author.id)) {
            const command_logs = client.channels.cache.get(command_logs_id).send({embeds: [new MessageEmbed().setColor("RED").setTitle("Command misuse").setDescription(`${client.emojisObj.animated_cross} ${message.author} tried to use a bot owner only prefix command in ${message.channel}.`).addField("Command", `/${command.name}`).setAuthor({name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 512 })}).setFooter({text: `ID| ${message.author.id}`})]})
            return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} **This command (${Prefix}${command.name}) can only be used by the owners of this bot.**`)]})  
        }
    }

    //Whitelist check
    if(command.whitelist && command.whitelist.length > 0 && !owners.includes(message.author.id) && !botOwners.includes(message.author.id)) {
        if (!command.whitelist.includes(message.author.id)) {
            return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross}  **To use this command (${Prefix}${command.name}), you need to be part of the whitlisted members.**`).addField("Whitelisted Members", `<@${command.whitelist.map((m)=> m).join(">, <@")}>`)]})
        }
    }

    const { cooldowns } = client;
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        const timeLeftEmbed = new MessageEmbed()
          .setColor("RED")
          .setDescription(`${client.emojisObj.animated_cross} Please wait another ${timeLeft.toFixed( 1 )} more seconds before using this command again` );
        return message.reply({ embeds: [timeLeftEmbed] })
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    message.noMentionReply = async (options) => {
      options.allowedMentions = { repliedUser: false };
      return await message.reply(options);
    };
    
    try {
      command.execute(message, args, commandName, Prefix, client);
    } catch (error) {
      console.log(error);
      const ErrorEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${client.emojisObj.animated_cross} An error occurred whilst running this command`);
      message.reply({ embeds: [ErrorEmbed] });
    }
  },
};
