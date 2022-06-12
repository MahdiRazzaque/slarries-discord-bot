const { Client, MessageEmbed, MessageAttachment, GuildMember } = require("discord.js");
//const Captcha = require("@haileybot/captcha-generator");

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function welcome(member) {
  const params = new URLSearchParams({
    avatar: member.displayAvatarURL({
      format: 'png'
    }),
    memcount: member.guild.memberCount,
    discrim: member.user.discriminator, //tag of user #6969
    name: member.user.username,
    bg: "https://file.coffee/u/bZcr9HMO3Nc-MW.png",
    header: `Welcome to ${member.guild.name}`
  });

  const image = 'https://badboy.is-a.dev/api/image/welcomecard?' + params + 
    "&apikey=DMNP5F9U51VZILZO9C"

  return image;
}

module.exports = {
  name: "guildMemberAdd",
  disabled: false,
  /**
   * @param {Client} client
   * @param {GuildMember} member
   */
  async execute(member, client) {
      const { user, guild } = member;

      if(member.user.id === "685840171752488984") return member.roles.add("916385872562229325");

      await member.roles.add("931883459834699817")

      const welcomeMessage = new MessageEmbed()
      .setColor("AQUA")
      .setImage("attachment://welcome.png")
      .addFields(
        { name: "Rules", value: "<#916385873120079916>", inline: true },
        { name: "Verify", value: "<#916661502163963964>", inline: true },
      )
      .setFooter({text: `ID: ${user.id}`});

    const channel = client.channels.cache.get("916385873120079914")

    delay(1000)
    .then(() => channel.send({ embeds: [welcomeMessage], files: [new MessageAttachment(welcome(member), "attachment://welcome.png")]}))
    .then(() => channel.send(`${member.user}`));
  
  // let captcha = new Captcha();

  //  const captchaAttachment = new MessageAttachment(captcha.JPEGStream, "captcha.jpeg");

  //  const captchaEmbed = new MessageEmbed()
  //    .setDescription("Please complete this captcha. \n *You have ten minutes.*")
  //    .setImage("attachment://captcha.jpeg")

  //  const msg = await member.send({
  //    files: [captchaAttachment],
  //    embeds: [captchaEmbed]
  //  })

  //  const filter = (message) => {
  //    if(message.author.id !== member.id) return;
  //    if(message.content.toUpperCase() === captcha.value) return true;
  //    else member.send({embeds: [new MessageEmbed().setColor("RED").setDescription("That is not the right answer. ❌")]});
  
  //  };

  //  try {
  //    const response = await msg.channel.awaitMessages({filter, max: 1, time: 600000, errors: ["time"]}) //600000

  //    if(response) {
  //      member.roles.add("916385872562229325")
  //      member.send({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`You have been verified in ${guild.name}`)]});
        
  //    }
  //  } catch (err) {
  //    await member.send({embeds: [new MessageEmbed().setColor("RED").setTitle("Failed to solve captcha").setDescription("You did not answer the captcha in time so you have been kicked you.").addField("Guild Invite", "https://discord.io/slarries")]});
  //    member.kick("Did not answer captcha in time.")
  //  }
  },
};
