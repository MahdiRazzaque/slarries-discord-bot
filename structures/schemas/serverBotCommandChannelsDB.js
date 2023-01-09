const { model, Schema } = require('mongoose');

module.exports = model("serverBotCommandChannelsDB", Schema({
    GuildID: String,
    BotCommandChannels: Array
}));