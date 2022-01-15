const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { admin_embed_colour } = require("../../structures/config.json");

function delay(time) {return new Promise((resolve) => setTimeout(resolve, time))}

module.exports = {
  name: "dm-role",
  description: "Message a user if they have a certain role.",
  usage: "/dm-role",
  disabled: false,
  permission: "ADMINISTRATOR",
  options: [
     {
      name: "role",
      description: "Mention the role",
      type: "ROLE",
      required: true,
    },
    {
      name: "message",
      description: "Provide the message you want the bot to send.",
      type: "STRING",
      required: true,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const role = interaction.options.getRole('role');
    const message = interaction.options.getString("message");
    
    const members = interaction.guild.roles.cache.get(role.id).members
    let memberIds = members.map(m => m.id);

    if(memberIds.length == 0)
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${role} has been given to 0 members, so I did not attempt to DM anyone.`).setFooter({text: "Thank you for using my code. | M4HD1#6336"})], ephemeral: true})

    const Embed = new MessageEmbed().setColor(admin_embed_colour)

    var successfulMembers = 0
    var successfulMembersList = []
    var failedMembers = 0
    var failedMembersList = []

    await interaction.reply({embeds: [new MessageEmbed().setColor(admin_embed_colour).setDescription(`**Sending dm to all users with the role ${role}**.\n\n> Successful DMs: ${successfulMembers}\n\n> Failed DMs: ${failedMembers}\n\n> Latest member: *Starting dms in 5 seconds.*`)], fetchReply: true})

    await delay(5000)

    for (var i = 0; i < memberIds.length; i++) {
      var member = client.users.cache.get(memberIds[i]);

      try {
        var sendMessage = await member.send({embeds: [new MessageEmbed().setColor("AQUA").setTitle("New role message 📨").setDescription(`${message}`).addFields({name: "Guild", value: `${interaction.guild.name}`, inline: true}, {name: "Role", value: `${role.name}`, inline: true}, {name: "Message Sender", value: `${interaction.member}`, inline: true})]})
        successfulMembers += 1
        successfulMembersList.push(member)
      } catch (error) {
        failedMembers += 1
        failedMembersList.push(member)
      }

      interaction.editReply({embeds: [Embed.setDescription(`**Sending dm to all users.**\n\n> Successful DMs: ${successfulMembers}\n\n> Failed DMs: ${failedMembers}\n\n> Latest member: ${member}`)]})
    
      await delay(3000)
    }

    interaction.editReply({content: `${interaction.member}`, embeds: [Embed.setDescription("**Finished sending dm to all users.**").addFields({name: "Successful DMs", value: `${successfulMembers}`}, {name: "Failed DMs", value: `${failedMembers}`, inline: true}, {name: "Successful members", value: `${successfulMembersList.map((m) => m).join(", ") || "None"}`}, {name: "Failed members", value: `${failedMembersList.map((m) => m).join(", ") || "None"}`})]})
  },
};