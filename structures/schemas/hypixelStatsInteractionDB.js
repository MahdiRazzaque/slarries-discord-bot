const { model, Schema } = require('mongoose');

module.exports = model("hypixelStatsInteractionDB", new Schema({
    GuildID: String,
    MessageID: String,
    Player: String,
    TypeOfStats: String,
    InteractionMemberID: String,
}))