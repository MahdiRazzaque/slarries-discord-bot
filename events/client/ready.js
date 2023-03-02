const { Client, MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const Ascii = require("ascii-table");

module.exports = {
  name: "ready",
  disabled: false,
  once: true,
  async execute(client) {
    clientTable = new Ascii("Client")

    //Maintenance
    setInterval(() => {
      if (client.maintenance) {
        client.user.setStatus("dnd");
        client.user.setActivity("Maintenance");
        return;
      }
      if (!client.maintenance && !client.customStatus){
        client.user.setStatus("online");
        client.user.setActivity("Slarries Discord Server", { type: "PLAYING" });
      }
    }, 30000);

    //Guilds
    const guilds = new Ascii("Guilds").setHeading("Name", "ID")
    client.guilds.cache.forEach((guild) => {
      guilds.addRow(`${guild.name}`, `${guild.id}`)
    });
    clientTable.addRow("Tag", client.user.tag)
    clientTable.addRow("Status", "Ready! 🔹")

    //Database
    if (!process.env.Database) return;
    mongoose.connect(process.env.Database, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(async () => { 
        console.log("The client is now connected to the database. 📚")
      })
      .catch((err) => { 
        console.log(err)
      });

    //Erela
    client.manager.init(client.user.id);
    
    //Systems
    ["lockdownSystem", "chatFilterSystem", "giveawaySystem", "ticketSystem", "hypixelStatsMenuSystem"].forEach((system) => {
        require(`../../systems/${system}`)(client);
    });  

    require("../../systems/lockdownSystem")(client);
    require("../../systems/chatFilterSystem")(client);

    //Emojis
    const emojisTable = new Ascii("Emojis").setHeading("Name", "Code")
    const g = client.guilds.cache.get('916385872356733000')
    const emojis = {};
    g.emojis.cache.map(e => {
        emojis[e.name] = `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`;
        emojisTable.addRow(e.name, `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`)
    })
    client.emojisObj = emojis;

    console.log(emojisTable.toString())

    //Embeds
    client.successEmbed = (message, emoji, colour) => {
      successEmbed = new MessageEmbed()
          .setDescription(`${emoji ? emoji : client.emojisObj.animated_tick} | ${message}`)
          .setColor(colour ? colour : "GREEN")
  
      return successEmbed
    };

    client.errorEmbed = (message, emoji, colour) => {
      errorEmbed = new MessageEmbed()
          .setDescription(`${emoji ? emoji : client.emojisObj.animated_cross} | ${message}`)
          .setColor(colour ? colour : "RED")
  
      return errorEmbed
    };
  },
};
