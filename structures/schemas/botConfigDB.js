const { model, Schema } = require('mongoose');

module.exports = model("botConfigDB", Schema({
    BotID: String,
    MaintenanceMode: Boolean,
}));