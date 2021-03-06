const { Events } = require("../validation/eventNames");

module.exports = async (client, PG, Ascii) => {
  const Table = new Ascii("Events Loaded").setHeading(`Name`, `Status`, `Reason`);

  (await PG(`${process.cwd()}/events/*/*.js`)).map(async (file) => {
    const event = require(file);

    if (event.name) {
      if(!Events.includes(event.name))
        return Table.addRow(file.split("/")[7], "🔸 FAILED", "Event name is missing.");
  }

    if(!event.disabled) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else  {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }

    await Table.addRow(event.name, "🔹 SUCCESSFUL");
  });

  console.log(Table.toString());
};
