const { MessageEmbed, Message, Client } = require("discord.js");
const { readdirSync } = require("fs");
const { stripIndent } = require("common-tags");
let color = "AQUA";
const create_mh = require(`../../functions/menu.js`);

module.exports = {
  name: "help",
  aliases: [],
  description: "View all prefix commands",
  usage: "!help",
  cooldown: 5,
  botCommandChannelOnly: true,
  ownerOnly: false,
  botOwnerOnly: false,
  roles: [],
  whitelist: [],
  /**
   * @param {Message} message 
   * @param {Client} client 
   */
  async execute(message, args, commandName, Prefix, client) {
    const helpcmd = args[0]
    const mbr = message.member.user.tag

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
        music: "🎼",
        minecraft: "🧱"
      };

      let ccate = [];
      readdirSync("./prefixCommands/").forEach((dir) => {
        if (ignored.includes(dir.toLowerCase())) return;
        const commands = readdirSync(`./prefixCommands/${dir}/`).filter((file) => file.endsWith(".js"));

        if (ignored.includes(dir.toLowerCase())) 
          return;

        const name = `${emo[dir]} - ${dir}`;
        let nome = dir.toUpperCase();

        let cats = new Object();
        cats = {
          name: name,
          value: `\`${Prefix}${commandName} ${dir.toLowerCase()}\``,
          inline: true,
        };

        categories.push(cats);
        ccate.push(nome);
      });

      const description = stripIndent`
            Use The Drop Down Menu Or Follow Given Commands Bellow
            You Can Also Type ${Prefix}${commandName} [command]
            `;
      
      const embed = new MessageEmbed()
        .setTitle(`Bot Prefix Commands`)
        .setDescription(`\`\`\`asciidoc\n${description}\`\`\``)
        .addFields(categories)
        .setFooter({text: `Requested by ${mbr}`, iconURL: message.member.user.displayAvatarURL({dynamic: true})})
        .setTimestamp()
        .setColor(color);

      let menus = create_mh(ccate);

      return await message.noMentionReply({ embeds: [embed], components: menus.smenu, fetchReply: true}).then(async (interactionn) => {
          const menuID = menus.sid;

          const select = async (interaction) => {
            if (interaction.customId != menuID) return;

            let { values } = interaction;

            let value = values[0];

            let catts = [];

            readdirSync("./prefixCommands/").forEach((dir) => {

              if (dir.toLowerCase() !== value.toLowerCase()) 
                return;

              const commands = readdirSync(`./prefixCommands/${dir}/`).filter(
                (file) => file.endsWith(".js")
              );

              const cmds = commands.map((command) => {
                let file = require(`../../prefixCommands/${dir}/${command}`);

                if (!file.name) 
                  return "No command name.";

                let name = file.name.replace(".js", "");

                if (client.prefixcommands.get(name)?.hidden)
                  return;

                let des = client.prefixcommands.get(name).description;
                let usg = client.prefixcommands.get(name).usage;

                if (!usg) 
                  usg = "No usage provided";
                
                let emo = client.prefixcommands.get(name).emoji;
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
                .setTitle(`__${value.charAt(0).toUpperCase() + value.slice(1)} Commands__`)
                .setDescription(`Use \`${Prefix}${commandName}\` followed by a command name to get more information on a command.\nFor example: \`${Prefix}${commandName} utilities\`.\n\n`)
                .addFields(catts)
                .setColor(color);

              await interaction.deferUpdate();

              return interaction.editReply({embeds: [combed], components: menus.smenu});
            }
          };
          const filter = (interaction) => {
            return (!message.member.user.bot && message.member.user.id == interaction.member.id)};

          const collector = interactionn.createMessageComponentCollector({ filter, componentType: "SELECT_MENU" });

          collector.on("collect", select);
          collector.on("end", () => null);
        });
    } else {
      let catts = [];

      readdirSync("./prefixCommands/").forEach((dir) => {
        if (dir.toLowerCase() !== helpcmd.toLowerCase()) 
          return;
        const commands = readdirSync(`./prefixCommands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        const cmds = commands.map((command) => {
          let file = require(`../../prefixCommands/${dir}/${command}`);

          if (!file.name) 
            return "No command name.";

          let name = file.name.replace(".js", "");

          if (client.prefixcommands.get(name)?.hidden)
            return;

          let usg = client.prefixcommands.get(name).usage;

          if (!usg) 
            usg = "No usage provided";
          

          let des = client.prefixcommands.get(name).description;
          let emo = client.prefixcommands.get(name).emoji;
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

      const command = client.prefixcommands.get(helpcmd.toLowerCase());

      if (cots.includes(helpcmd.toLowerCase())) {
        const combed = new MessageEmbed()
          .setTitle(`__${helpcmd.charAt(0).toUpperCase() + helpcmd.slice(1)} Commands__`)
          .setDescription(`Use \`${Prefix}${commandName}\` followed by a command name to get more information on a command.\nFor example: \`${Prefix}${commandName} utilities\`.\n\n`)
          .addFields(catts)
          .setColor(color);

        return message.noMentionReply({ embeds: [combed] });
      }

      if (!command) {
        const embed = new MessageEmbed()
          .setTitle(`Invalid command! Make sure you didn't use spaces. Use \`${Prefix}${commandName}\` for all of my commands.`)
          .setColor("RED");

        return await message.noMentionReply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      }
      const embed = new MessageEmbed()
        .setTitle("Command Details:")
        .addField("Command:", command.name ? `\`${command.name}\`` : "No name for this command.")
        .addField("Usage:", command.usage ? `\`${command.usage}\`` : `\`/${command.name}\`` )
        .addField("Command Description:", command.description ? command.description : "No description for this command.")
        .setFooter({text: `Requested by ${mbr}`, iconURL: message.member.user.displayAvatarURL({dynamic: true})})
        .setTimestamp()
        .setColor(color);
        
      return await message.noMentionReply({ embeds: [embed] });
    }
  },
};
