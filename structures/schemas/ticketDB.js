const { model, Schema } = require("mongoose");

module.exports = model(
    "ticketDB",
    new Schema({
        GuildID: String,
        MembersID: [String],
        TicketID: String,
        ChannelID: String,
        Closed: Boolean,
        Locked: Boolean,
        Type: String,
        Claimed: Boolean,
        ClaimedBy: String,
        OpenTime: String,
    })
)