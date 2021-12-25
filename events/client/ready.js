const { Client } = require("discord.js");
const modmailClient = require("../modMail/modmail")
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3000;

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    modmailClient.ready()
    setInterval(() => {
      if (client.maintenance) {
        client.user.setStatus("dnd");
        client.user.setActivity("Maintenance");
        return;
      }
      if (!client.maintenance) {
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
    mongoose
      .connect(process.env.Database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("The client is now connected to the database. 📚");
      })
      .catch((err) => {
        console.log(err);
      });

    app.get("/", function (req, res) {
      res.write("<h1> Connected as " + client.user.tag + "</h1>");
      res.write("<h2> Ready! &#128994 </h2>");
      res.send();
    });

    app.listen(port, () =>
      console.log(`Slarries Website: http://localhost:${port}`)
    );
  },
};
