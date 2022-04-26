const { model, Schema } = require("mongoose");

module.exports = model(
    "toDoListDB",
    new Schema({
        MemberID: String,
        List: Array,
        ChannelID: String,
        MessageID: String,
        PrivacyMode: Boolean,
        MessageCreateToAdd: Boolean,
    })
)