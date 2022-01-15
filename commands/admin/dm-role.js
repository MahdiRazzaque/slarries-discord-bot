const { MessageEmbed, Client, CommandInteraction } = require("discord.js");

module.exports = {
  name: "dm-role",
  description: "Message a user if they have a certain role.",
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
    console.log(members)

    //await members.forEach(member => member.send({embeds: [new MessageEmbed().setColor("AQUA").setTitle("New role message 📨").setDescription(`${message}`).addFields({name: "Guild", value: `${interaction.guild.name}`}, {name: "Role", value: `${role.name}`}, {name: "Message Sender", value: `${interaction.member}`})]}).catch(e => {}))
    
    interaction.reply({embeds: [new MessageEmbed().setColor("AQUA").setDescription(`The message was sent to all users (with their DMs open)`)], ephemeral: true})
  },
};