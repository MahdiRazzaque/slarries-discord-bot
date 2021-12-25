const { model, Schema } = require('mongoose');

module.exports = model("suggestDB", new Schema({
    GuildID: String,
    MessageID: String,
    Details: Array,
}))