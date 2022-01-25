const DB = require("../structures/schemas/filterDB");

module.exports = (client) => {
    DB.find().then((documents) => {
        documents.forEach((doc) => {
            client.filters.set(doc.Guild, doc.Words);
            client.filtersLog.set(doc.Guild, doc.Log);
        })
    })
}