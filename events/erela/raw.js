const client = require("../../structures/bot.js");

client.on("raw", (d) => client.manager.updateVoiceState(d));