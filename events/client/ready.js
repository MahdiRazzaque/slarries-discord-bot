const { Client } = require("discord.js");
const modmailClient = require("../modMail/modmail")
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3000;

module.exports = {
  name: "ready",
  disabled: false,
  once: true,
  async execute(client) {
    console.log("======================================================================")
    modmailClient.ready()
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
    console.log("Connected as " + client.user.tag);
    client.guilds.cache.forEach((guild) => {
      console.log(`${guild.name} | ${guild.id}`);
    });
    console.log("Ready! 🟢");

    if (!process.env.Database) return;
    mongoose.connect(process.env.Database, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(async () => { 
        console.log("The client is now connected to the database. 📚")
        console.log("======================================================================")
      })
      .catch((err) => { console.log(err) });

    require("../../systems/lockdownSystem")(client);
    require("../../systems/chatFilterSystem")(client);

    //Emojis
    const g = client.guilds.cache.get('916385872356733000')
    const emojis = {};
    g.emojis.cache.map(e => {
        emojis[e.name] = `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`;
    })
    client.emojisObj = emojis;
    console.log(client.emojisObj)
    
    app.get("/", function (req, res) {
      res.write("<h1> Connected as " + client.user.tag + "</h1>");
      res.write("<h2> Ready! &#128994 </h2>");
      res.send();
    });

    app.listen(port, () => {
    console.log(`Slarries Website: http://localhost:${port}`)
    console.log("======================================================================")
    
    });
    console.log("======================================================================")
  },
};
