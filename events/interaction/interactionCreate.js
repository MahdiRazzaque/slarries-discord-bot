const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { owners, botOwners, command_logs_id, botCommandChannels } = require("../../structures/config.json")

module.exports = {
  name: "interactionCreate",
  disabled: false,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
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
        return (interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("🛑 An error has occured whilst running this command")]}) && client.commands.delete(interaction.commandName));

      if(command.disabled == true) {
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> **This command (/${command.name}) is currently disabled**`)], ephemeral: true})
      }

      if(command.ownerOnly == true) {
        if(!owners.includes(interaction.member.id)) {
          const command_logs = client.channels.cache.get(command_logs_id).send({embeds: [new MessageEmbed().setColor("RED").setTitle("Command misuse").setDescription(`<a:animated_cross:925091847905366096> ${interaction.member} tried to use a owner only command.`).addField("Command", `/${command.name}`).setAuthor(interaction.user.tag, interaction.user.avatarURL({ dynamic: true, size: 512 })).setFooter({text: `ID| ${interaction.user.id}`})]})
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> **This command (/${command.name}) can only be used by the owners of this server**`)], ephemeral: true})  
        }
      }
      
      if(command.botOwnerOnly == true) {
        if(!botOwners.includes(interaction.member.id)) {
          const command_logs = client.channels.cache.get(command_logs_id).send({embeds: [new MessageEmbed().setColor("RED").setTitle("Command misuse").setDescription(`<a:animated_cross:925091847905366096> ${interaction.member} tried to use a bot owner only command.`).addField("Command", `/${command.name}`).setAuthor(interaction.user.tag, interaction.user.avatarURL({ dynamic: true, size: 512 })).setFooter(`ID| ${interaction.user.id}`)]})
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> **This command (/${command.name}) can only be used by the owners of this bot.**`)], ephemeral: true})  
        }
      }

      if(command.botCommandChannelOnly == true) {
        if(!botCommandChannels.includes(interaction.channelId)) {
          return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> **This command (/${command.name}) can only be used in bot command channels. These channels are: <#${botCommandChannels.map((c) => c).join(">, <#")}>**`)], ephemeral: true})
        }
      }

      if(command.roles) {
        for (var i = 0; i < command.roles.length; i++) {
          if (!interaction.member.roles.cache.has(command.roles[i])) {
            continue;
          } 
          if (interaction.member.roles.cache.has(command.roles[i])) {
            var valid = true;
        }
      }
      if(!valid)
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`<a:animated_cross:925091847905366096> **To use this command (/${command.name}), you need one of the following roles:\n<@&${command.roles.map((r) => r).join(">, <@&")}>**`)], ephemeral: true});
      }

      const cmd = client.commands.get(interaction.commandName);

      command.execute(interaction, client);
    }
  },
};