//Base for starting the bot
const DiscordJS = require("discord.js");
const { Client, Intents } = require("discord.js");
const fs = require("fs");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");
const dotenv = require("dotenv");
dotenv.config();

const client = new DiscordJS.Client({ intents: 32767, partials: ["REACTION", "CHANNEL", "MESSAGE"] });
module.exports = client;

//Command Handler
client.commands = new DiscordJS.Collection();
client.events = new DiscordJS.Collection();

require("../systems/giveawaySystem")(client);

["events", "commands"].forEach((handler) => {
  require(`./handlers/${handler}`)(client, PG, Ascii);
});

//Maintenance mode
client.maintenance = false;

//Music
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddListWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()],
});
module.exports = client;

//Logging into the bot
client.login(process.env.TOKEN);
