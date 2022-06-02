//Base for starting the bot
const { Client, Collection } = require("discord.js");
const fs = require("fs");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({ intents: 131071, partials: ["REACTION", "CHANNEL", "MESSAGE"]}); //, allowedMentions: {repliedUser: false}

//Collections
client.commands = new Collection();
client.prefixcommands = new Collection();
client.cooldowns = new Collection();
client.events = new Collection();
client.filters = new Collection();
client.filtersLog = new Collection();

//Handlers
require("../systems/giveawaySystem")(client);

["events", "commands", "prefixCommands"].forEach((handler) => {
  require(`./handlers/${handler}`)(client, PG, Ascii);
});

//Maintenance mode
client.maintenance = false;
client.customStatus = false;

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

//Discord Together
const { DiscordTogether } = require('discord-together'); 
client.discordTogether = new DiscordTogether(client);

//Anti Crash
require("./antiCrash")(client);

//Logging into the bot
client.login(process.env.TOKEN);
