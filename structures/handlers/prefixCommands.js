const { Perms } = require("../validation/permissions");
const { Client } = require("discord.js");
/**
 * @param {Client} client
 */
module.exports = async (client, PG, Ascii) => {
  const Table = new Ascii("Prefix Commands");

  prefixCommandsArray = [];

  (await PG(`${process.cwd()}/prefixCommands/**/*.js`)).map(async (file) => {
    const command = require(file);

    if (!command.name)
      return Table.addRow(file.split("/")[7], "🔸 Missing a name");

    if (!command.type && !command.description)
      return Table.addRow(command.name, "🔸 Missing a description");

    if (command.permission) {
      if (Perms.includes(command.permission)) command.defaultPermission = false;
      else return Table.addRow(command.name, "🔸 Permission is invalid");
    }

    client.prefixcommands.set(command.name, command);
    prefixCommandsArray.push(command);

    Table.setHeading(`Name`, `Status`, `Reason`);
    await Table.addRow(command.name, "🔹 Success");
  });
  console.log(Table.toString());
};
