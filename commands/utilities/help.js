const { MessageEmbed, Message, CommandInteraction, Client } = require("discord.js");
const { readdirSync } = require("fs");
const { stripIndent } = require("common-tags");
let color = "AQUA";
const create_mh = require(`../../functions/menu.js`);

module.exports = {
  name: "help",
  description: "Shows all available bot commands",
  usage: "/help",
  disabled: false,
  options: [
    {
      name: "command",
      description:
        "Enter the command or category that you want to get help with.",
      required: false,
      type: "STRING",
    },
  ],

  async execute(interaction, client) {
    const helpcmd = interaction.options.getString("command");
    const mbr = interaction.user.tag;

    let categories = [];
    let cots = [];

    if (!helpcmd) {
      let ignored = ["admin", "developer"];
      const emo = {
        developer: "🗒️",
        admin: "🔧",
        moderation: "🔧",
        utilities: "⚙️",
        fun: "🥳",
        systems: "💻",
        music: "🎼"
      };

      let ccate = [];
      readdirSync("./commands/").forEach((dir) => {
        if (ignored.includes(dir.toLowerCase())) return;
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        if (ignored.includes(dir.toLowerCase())) return;

        const name = `${emo[dir]} - ${dir}`;
        let nome = dir.toUpperCase();

        let cats = new Object();
        cats = {
          name: name,
          value: `\`/help ${dir.toLowerCase()}\``,
          inline: true,
        };

        categories.push(cats);
        ccate.push(nome);
      });

      const description = stripIndent`
            Use The Drop Down Menu Or Follow Given Commands Bellow
            You Can Also Type /help [command]
            `;
      const embed = new MessageEmbed()
        .setTitle(`Bot Commands`)
        .setDescription(`\`\`\`asciidoc\n${description}\`\`\``)
        .addFields(categories)
        .setFooter(
          `Requested by ${mbr}`,
          interaction.user.displayAvatarURL({
            dynamic: true,
          })
        )
        .setTimestamp()
        .setColor(color);

      let menus = create_mh(ccate);

      return await interaction
        .reply({
          embeds: [embed],
          components: menus.smenu,
          fetchReply: true,
        })
        .then(async (interactionn) => {
          const menuID = menus.sid;

          const select = async (interaction) => {
            if (interaction.customId != menuID) return;

            let { values } = interaction;

            let value = values[0];

            let catts = [];

            readdirSync("./commands/").forEach((dir) => {
              if (dir.toLowerCase() !== value.toLowerCase()) return;
              const commands = readdirSync(`./commands/${dir}/`).filter(
                (file) => file.endsWith(".js")
              );
              const cmds = commands.map((command) => {
                let file = require(`../../commands/${dir}/${command}`);

                if (!file.name) return "No command name.";

                let name = file.name.replace(".js", "");

                if (client.commands.get(name).hidden) return;

                let des = client.commands.get(name).description;
                let usg = client.commands.get(name).usage;
                if (!usg) {
                  usg = "No usage provided";
                }
                let emo = client.commands.get(name).emoji;
                let emoe = emo ? `${emo} - ` : ``;

                let obj = {
                  cname: `${emoe}\`${name}\` |  **${usg}**`,
                  des,
                };

                return obj;
              });

              let dota = new Object();

              cmds.map((co) => {
                if (co == undefined) return;

                dota = {
                  name: `${cmds.length === 0 ? "In progress." : co.cname}`,
                  value: co.des ? co.des : `No Description`,
                  inline: true,
                };
                catts.push(dota);
              });

              cots.push(dir.toLowerCase());
            });

            if (cots.includes(value.toLowerCase())) {
              const combed = new MessageEmbed()
                .setTitle(
                  `__${
                    value.charAt(0).toUpperCase() + value.slice(1)
                  } Commands__`
                )
                .setDescription(
                  `Use \`/help\` followed by a command name to get more information on a command.\nFor example: \`/help utilities\`.\n\n`
                )
                .addFields(catts)
                .setColor(color);

              await interaction.deferUpdate();

              return interaction.editReply({
                embeds: [combed],
                components: menus.smenu,
              });
            }
          };
          const filter = (interaction) => {
            return (
              !interaction.user.bot &&
              interaction.user.id == interaction.member.id
            );
          };

          const collector = interactionn.createMessageComponentCollector({
            filter,
            componentType: "SELECT_MENU",
          });
          collector.on("collect", select);
          collector.on("end", () => null);
        });
    } else {
      let catts = [];

      readdirSync("./commands/").forEach((dir) => {
        if (dir.toLowerCase() !== helpcmd.toLowerCase()) return;
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        const cmds = commands.map((command) => {
          let file = require(`../../commands/${dir}/${command}`);
          if (!file.name) return "No command name.";
          let name = file.name.replace(".js", "");
          if (client.commands.get(name).hidden) return;
          let usg = client.commands.get(name).usage;
          if (!usg) {
            usg = "No usage provided";
          }

          let des = client.commands.get(name).description;
          let emo = client.commands.get(name).emoji;
          let emoe = emo ? `${emo} - ` : ``;
          let obj = {
            cname: `${emoe}\`${name}\` |  **${usg}**`,
            des,
          };
          return obj;
        });
        let dota = new Object();
        cmds.map((co) => {
          if (co == undefined) return;
          dota = {
            name: `${cmds.length === 0 ? "In progress." : co.cname}`,
            value: co.des ? co.des : `No Description`,
            inline: true,
          };
          catts.push(dota);
        });

        cots.push(dir.toLowerCase());
      });

      const command = client.commands.get(helpcmd.toLowerCase());

      if (cots.includes(helpcmd.toLowerCase())) {
        const combed = new MessageEmbed()
          .setTitle(
            `__${
              helpcmd.charAt(0).toUpperCase() + helpcmd.slice(1)
            } Commands__`
          )
          .setDescription(
            `Use \`/help\` followed by a command name to get more information on a command.\nFor example: \`/help utilities\`.\n\n`
          )
          .addFields(catts)
          .setColor(color);

        return interaction.reply({ embeds: [combed] });
      }

      if (!command) {
        const embed = new MessageEmbed()
          .setTitle(
            `Invalid command! Make sure you didn't use spaces. Use \`/help\` for all of my commands.`
          )
          .setColor("RED");
        return await interaction.reply({
          embeds: [embed],
          allowedMentions: {
            repliedUser: false,
          },
        });
      }
      const embed = new MessageEmbed()
        .setTitle("Command Details:")
        .addField(
          "Command:",
          command.name ? `\`${command.name}\`` : "No name for this command."
        )
        .addField(
          "Usage:",
          command.usage ? `\`${command.usage}\`` : `\`/${command.name}\``
        )
        .addField(
          "Command Description:",
          command.description
            ? command.description
            : "No description for this command."
        )
        .setFooter(
          `Requested by ${mbr}`,
          interaction.user.displayAvatarURL({
            dynamic: true,
          })
        )
        .setTimestamp()
        .setColor(color);
      return await interaction.reply({
        embeds: [embed],
      });
    }
  },
};
