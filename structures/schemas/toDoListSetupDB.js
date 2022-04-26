const { model, Schema } = require("mongoose");

module.exports = model(
    "toDoListSetupDB",
    new Schema({
        GuildID: String,
        CategoryID: String,
        WhitelistedRoles: Array,
        BlacklistedRoles: Array,
        Disabled: Boolean,
    })
)