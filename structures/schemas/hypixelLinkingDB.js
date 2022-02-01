const { model, Schema } = require("mongoose");

module.exports = model(
    "hypixelLinkingDB",
    new Schema({
        id: String,
        uuid: String,
    })
)