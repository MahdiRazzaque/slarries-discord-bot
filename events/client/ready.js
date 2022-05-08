const { Client } = require("discord.js");
const mongoose = require("mongoose");
const Ascii = require("ascii-table");
const express = require("express");
const app = express();
const port = 3000;

module.exports = {
  name: "ready",
  disabled: false,
  once: true,
  async execute(client) {
    clientTable = new Ascii("Client")
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
    const guilds = new Ascii("Guilds").setHeading("Name", "ID")
    client.guilds.cache.forEach((guild) => {
      guilds.addRow(`${guild.name}`, `${guild.id}`)
    });
    clientTable.addRow("Tag", client.user.tag)
    clientTable.addRow("Status", "Ready! 🔹")

    if (!process.env.Database) return;
    mongoose.connect(process.env.Database, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(async () => { 
        console.log("The client is now connected to the database. 📚")
      })
      .catch((err) => { 
        console.log(err)
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
    
    //Always online
    app.get("/", function (req, res) {
      res.write("<h1> Connected as " + client.user.tag + "</h1>");
      res.write("<h2> Ready! &#128994 </h2>");
      res.send();
    });

    app.listen(port, async () => {
    console.log(`Slarries Website: http://localhost:${port}`)
    });
    console.log(guilds.toString())
    console.log(clientTable.toString())
  },
};
