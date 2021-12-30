const { Client, MessageEmbed, MessageAttachment } = require("discord.js");
//const { Captcha } = require ("captcha-canvas");
const { guild_log_colour, guild_logs_id, guildMemberAdd_logging, guild_welcome_message } = require("../../structures/config.json");

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {Client} client
   * @param {guildMember} member
   */
  async execute(member, client) {
    if(guild_welcome_message) {
      const { user, guild } = member;

      const welcomeMessage = new MessageEmbed()
      .setColor("AQUA")
      .setTitle(`**Welcome to Slarries**`)
      .setDescription("> Please read the rules and verify.")
      .addFields(
        { name: "Rules", value: "<#916385873120079916>", inline: true },
        { name: "Verify", value: "<#916661502163963964>", inline: true },
      )
      .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
      .setFooter(`ID: ${user.id}`);

    const channel = client.channels.cache.get("916385873120079914")

    delay(1000)
    .then(() => channel.send({ embeds: [welcomeMessage] }))
    .then(() => channel.send(`${member.user}`));
    }

    // const captcha = new Captcha();
    // captcha.async = true;
    // captcha.addDecoy();
    // captcha.drawTrace();
    // captcha.drawCaptcha()

    // const captchaAttachment = new MessageAttachment(await captcha.png, "captcha.png");

    // const captchaEmbed = new MessageEmbed()
    //   .setDescription("Please complete this captcha. \n *You have ten minutes.*")
    //   .setImage("attachment://captcha.png")

    // const msg = await member.send({
    //   files: [captchaAttachment],
    //   embeds: [captchaEmbed]
    // })

    // const filter = (message) => {
    //   if(message.author.id !== member.id) return;
    //   if(message.content === captcha.text) return true;
    //   else member.send({embeds: [new MessageEmbed().setColor("RED").setDescription("That is not the right answer. ❌")]});
  
    // };

    // try {
    //   const response = await msg.channel.awaitMessages({filter, max: 1, time: 100000, errors: ["time"]}) //600000

    //   if(response) {
    //     member.roles.add("916385872562229325")
    //     member.send({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`You have been verified in ${guild.name}`)]});
        
    //   }
    // } catch (err) {
    //   await member.send({embeds: [new MessageEmbed().setColor("RED").setTitle("Failed to solve captcha").setDescription("You did not answer the captcha in time so I have kicked you.").addField("Guild Invite", "https://discord.io/slarries")]});
    //   member.kick("Did not answer captcha in time.")
    // }



    if (guildMemberAdd_logging) {
      const { user, guild } = member;

      const Log = new MessageEmbed()
        .setColor(guild_log_colour)
        .setTitle("__Member Joined__🐣")
        .setDescription(`${user} joined the server.`)
        .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
        .addField("ID", `${user.id}`)
        .addField(
          "Discord User since",
          `<t:${parseInt(user.createdTimestamp / 1000)}:R>`,
          true
        )
        .setTimestamp();

      const guild_logs = client.channels.cache
        .get(guild_logs_id)
        .send({ embeds: [Log] });
    }
  },
};
