//Base for starting the bot
const { Client, Collection, MessageEmbed } = require("discord.js");
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
["events", "commands", "prefixCommands"].forEach((handler) => {
  require(`./handlers/${handler}`)(client, PG, Ascii);
});

//Maintenance mode
client.maintenance = false;
client.customStatus = false;

module.exports = client;

const { nodes, SpotifyClientID, SpotifySecret } = require("./config.json")
const Deezer = require("erela.js-deezer");
const Spotify = require("better-erela.js-spotify").default;
const Apple = require("better-erela.js-apple").default;
const { Manager } = require("erela.js");

client.manager = new Manager({
    nodes,
    plugins: [
        new Spotify({
            clientID: SpotifyClientID,
            clientSecret: SpotifySecret,
        }),
        new Apple(),
        new Deezer(),
    ],
    send: (id, payload) => {
        let guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
});

//Discord Together
const { DiscordTogether } = require('discord-together'); 
client.discordTogether = new DiscordTogether(client);

//Anti Crash
require("./antiCrash")(client);

//Logging into the bot
client.login(process.env.TOKEN);
