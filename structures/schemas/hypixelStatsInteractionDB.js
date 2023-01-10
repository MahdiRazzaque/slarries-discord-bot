const { model, Schema } = require('mongoose');

module.exports = model("hypixelStatsInteractionDB", new Schema({
    GuildID: String,
    ChannelID: String,
    MessageID: String,
    Player: String,
    TypeOfStats: String,
    InteractionMemberID: String,
    DateOpened: Number,
}))