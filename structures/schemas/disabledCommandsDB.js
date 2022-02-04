const { model, Schema } = require('mongoose');

module.exports = model("disabledCommandsDB", Schema({
    GuildID: String,
    Commands: Array
}));