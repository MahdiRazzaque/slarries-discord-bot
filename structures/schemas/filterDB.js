const { model, Schema } = require("mongoose");

module.exports = model(
    "filterDB",
    new Schema({
        Guild: String,
        Log: String,
        Words: [String],
    })
)