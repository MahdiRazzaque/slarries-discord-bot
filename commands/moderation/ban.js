const {Client, CommandInteraction, MessageEmbed} = require("discord.js");
const { moderation_embed_colour } = require("../../structures/config.json");

function delay(time) {return new Promise((resolve) => setTimeout(resolve, time))}

module.exports = {
  name: "ban",
  description: "Used to ban a target",
  usage: "/ban",
  userPermissions: ["BAN_MEMBERS"],
  disabled: false,
  options: [
    {
      name: "target",
      description: "Select a target to ban",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "Provide a reason to ban that member",
      type: "STRING",
      required: false,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {    
    const { options } = interaction;
    const Target = options.getMember("target");
    const Reason = options.getString("reason") || "No reason provided"
    const guild = interaction.guild;

    if(!Target?.id)
      return interaction.reply({ embeds: [client.errorEmbed("This member was not found.")]})

    if(Target.id === interaction.member.id)
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You can't ban yourself.`)], ephemeral: true});
  
    if(Target.id === client.user.id)
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} I can't ban myself.`)], ephemeral: true});

    if(Target.permissions.has("ADMINISTRATOR"))
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You can't ban an admin.`)], ephemeral: true});

    if(Target.permissions.has("MANAGE_GUILD"))
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} You can't ban a moderator.`)], ephemeral: true});
  
	  if(!Target.bannable)
		  return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} I don't have the permissions to ban ${Target}.`)], ephemeral: true});

    if (Reason?.length > 512)
		  return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${client.emojisObj.animated_cross} Reason can't be more than 512 characters.`)], ephemeral: true});

    await Target.send({embeds: [new MessageEmbed().setColor(moderation_embed_colour).setTitle(`👮 You've been banned From ${interaction.guild.name}`).addFields({name: "Reason", value: `\`${Reason}\``}, {name: "Banned by", value: `\`${interaction.member.user.tag}\``})]})

    const memberBannedTag = Target.user.tag

    await Target.ban({ reason: Reason });

    return interaction.reply({ embeds: [client.successEmbed(`\`${memberBannedTag}\` has successfully been banned from this server by \`${interaction.member.user.tag}\``).addFields({name: "Reason", value: `\`${Reason}\``}).setThumbnail(Target.user.avatarURL({ dynamic: true, size: 512 }))] });
  },
};