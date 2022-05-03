 const { CommandInteraction, MessageEmbed, Client, Channel } = require("discord.js");
 const DB = require("../../structures/schemas/lockdownDB");
 const ms = require("ms");

 module.exports = {
     name: "lock",
     description: "Lockdown this channel",
     usage: "/lock",
     userPermissions: ["MANAGE_CHANNELS"],
     options: [
         {
             name: "time",
             description: "Expire date for this lockdown (1m, 1h. 1d)",
             type: "STRING"
         },
         {
             name: "reason",
             description: "Provide a reason for this lockdown.",
             type: "STRING"
         }
     ],
     /**
      * 
      * @param {CommandInteraction} interaction 
      * @param {Client} client 
      */
     async execute(interaction, client) {
         const { guild, channel, options } = interaction;

         const Reason = options.getString("reason" || "No specified reason");

         const Embed = new MessageEmbed();

         if(!channel.permissionsFor(guild.id).has("SEND_MESSAGES"))
            return interaction.reply({embeds: [Embed.setColor("RED").setDescription(`${client.emojisObj.animated_cross} This channel is already locked.`)], ephemeral: true})

        channel.permissionOverwrites.edit(guild.id, {SEND_MESSAGES: false})

        const Time = options.getString("time");

        var expireDate = Date.now() + ms(Time)
        expireDate = expireDate.toString().slice(0, -3)

        interaction.reply({ embeds: [Embed.setColor("RED").setDescription(`🔒 This channel is now under locked. \nㅤ`).addFields({name: "Reason", value: `${Reason || "No reason provided."}`}, {name: "Time", value: `<t:${expireDate}:R>`})]})

        if(Time) {
            const ExpireDate = Date.now() + ms(Time);
            DB.create({ GuildID: guild.id, ChannelID: channel.id, Time: ExpireDate})

            setTimeout(async () => {
                channel.permissionOverwrites.edit(guild.id, {SEND_MESSAGES: null})
                interaction.editReply({embeds: [Embed.setDescription("🔓 The lockdown has been lifted \nㅤ").setColor("GREEN")]}).catch(() => {})
                await DB.deleteOne({ ChannelID: channel.id })
            }, ms(Time))
        }
     }
 }