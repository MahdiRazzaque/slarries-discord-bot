const { CommandInteraction, MessageEmbed, MessageAttachment } = require("discord.js");
const { reaction_role_embed_colour } = require("../../structures/config.json");

module.exports = {
  name: "send-preset-embed",
  description: "Send a preset embed to a specific channel.",
  usage: "/send-preset-embed",
  permission: "ADMINISTRATOR",
  disabled: false,
  ownerOnly: true,
  options: [
    {
        name: "embed",
        description: "embed",
        type: "STRING",
        required: true,
        choices: [
            {
                name: "reactionrole-country",
                value: "reactionrole-country",
            },
            {
                name: "rules",
                value: "rules",
            },
            {
              name: "slayer-prices",
              value: "slayer-prices",
            },
            {
              name: "slayer-survival",
              value: "slayer-survival",
            },
            {
              name: "frequent-questions",
              value: "frequent-questions",
            },
        ]
    },
    {
      name: "channel",
      description: "Select a channel to send the embed to.",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    
    const { options } = interaction;

    const choices = options.getString("embed");
    const gChannel = options.getChannel("channel") || interaction.channel;

    switch (choices) {
        case "reactionrole-country": {
          const sendMessage = await client.channels.cache.get(gChannel.id).send({embeds: [new MessageEmbed().setTitle("**Please pick your continent role:**").setDescription("<:northamerica:884044909202530344> - North America \n<:southamerica:884044909424828426> - South America\n <:europe:884044909122830336> - Europe \n<:asia:884039823587954738> - Asia \n<:africa:884039822371598367> - Africa \n<:oceania:884039824045125662> - Oceania").setColor(reaction_role_embed_colour)]})
          interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${client.emojisObj.animated_tick} Sent reactionrole-country embed.`)],ephemeral: true})
        }
        break;
        case "rules": {
            const sendMessage = await client.channels.cache.get(gChannel.id).send({embeds: [new MessageEmbed().setTitle("__**Rules!**__").setDescription("\n**1. Follow Discord's TOS** \n> https://discordapp.com/terms \n> https://discordapp.com/guidelines \n \n**2. Be respectful with all members** \n> Be respectful to others , No death threats, sexism, hate speech, racism (NO N WORD, this includes soft N) \n> No doxxing, swatting, witch hunting \n \n**3. No Advertising** \n> Includes DM Advertising. We do not allow advertising here of any kind. \n \n**4. No NSFW content** \n> Anything involving gore or sexual content is not allowed. \n> NSFW = Not Safe for Work \n \n**5. No spamming in text or VC** \n> Do not spam messages, soundboards, voice changers, or earrape in any channel. \n \n**6. Do not discuss about sensitive topics** \n> This isn't a debating server, keep sensitive topics out of here so we don't have a ton of nasty arguments. \n \n**7. No malicious content** \n> No grabify links, viruses, crash videos, links to viruses, or token grabbers. These will result in an automated ban. \n \n**8. No Self Bots** \n> Includes all kinds of selfbots: Nitro snipers, selfbots like nighty, auto changing statuses \n \n**9. Do not DM the staff team ** \n> Please open a ticket instead in \n \n**10. Profile Picture / Banner Rules** \n> No NSFW allowed \n> No racism \n> No brightly flashing pictures to induce an epileptic attack \n \n**11. Emoji Rules** \n> No NSFW allowed \n> No racism \n> No brightly flashing pictures to induce an epileptic attack \n \n**12. Use English only** \n> We cannot easily moderate chats in different languages, sorry. English only.").setColor("NAVY")]})
            interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${client.emojisObj.animated_tick} Sent rules embed.`)],ephemeral: true})
        }
        break;
        case "slayer-prices": {
          const slayerPrices = await client.channels.cache.get(gChannel.id).send({embeds: [new MessageEmbed().setTitle("__**Slayer Prices!**__").setColor("BLUE")]})
          const revenantHorror = await client.channels.cache.get(gChannel.id).send({embeds: [new MessageEmbed().setTitle("Revenant Horror").setDescription("> Tier 1 - 25k \n> Tier 2 - 50k \n> Tier 3 - 100k \n> Tier 4 - 200k \n> Tier 5 - 450k").setColor("BLUE")]})
          const tarantulaBroodfather = await client.channels.cache.get(gChannel.id).send({embeds: [new MessageEmbed().setTitle("Tarantula Broodfather").setDescription("> Tier 1 - 25k \n> Tier 2 - 50k \n> Tier 3 - 100k \n> Tier 4 - 200k").setColor("BLUE")]})
          const svenPackmaster = await client.channels.cache.get(gChannel.id).send({embeds: [new MessageEmbed().setTitle("Sven Packmaster").setDescription("> Tier 1 - 25k \n> Tier 2 - 50k \n> Tier 3 - 125K \n> Tier 4 - 250k").setColor("BLUE")]})
          const voidgloomSeraph = await client.channels.cache.get(gChannel.id).send({embeds: [new MessageEmbed().setTitle("Voidgloom Seraph").setDescription("> Tier 1 - 50k \n> Tier 2 - 200k \n> Tier 3 - 400K").setColor("BLUE")]})
          await interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${client.emojisObj.animated_tick} Sent slayer prices embed. `)],ephemeral: true})
        }
        break;
        case "slayer-survival": {
          const tipsOnHowToSurvive = await client.channels.cache.get(gChannel.id).send({embeds: [new MessageEmbed().setTitle("__**Tips on how to survive**__").setDescription("> You will be expected to survive \n \n> If you cannot survive, I can give you a wither cloak sword + full goblin armour set \n \n> In return I would like a collat based on the current market price of ult wise V wither cloak swords + 100k.").setColor("BLUE")]})
          const suriveRevenantHorror = await client.channels.cache.get(gChannel.id).send({embeds: [new MessageEmbed().setTitle("Revenant Horror").setDescription("> Just stay away from the boss once it spawns.").setColor("BLUE")]})
          const suriveTarantulaBroodfather = await client.channels.cache.get(gChannel.id).send({embeds: [new MessageEmbed().setTitle("Tarantula Broodfather").setDescription("> Just stay away from the boss once it spawns.").setColor("BLUE")]})
          const suriveSvenPackmaster = await client.channels.cache.get(gChannel.id).send({embeds: [new MessageEmbed().setTitle("Sven Packmaster").setDescription("> Just stay away from the boss once it spawns.").setColor("BLUE")]})
          const suriveVoidgloomSeraph = await client.channels.cache.get(gChannel.id).send({embeds: [new MessageEmbed().setTitle("Voidgloom Seraph").setDescription("> When the boss spawns, quickly activate creeper viel. \n \n> Then, swap to goblin armour. \n \n> Make sure you hold the wither cloak sword for the entire boss fight. \n \n> Try to get in a high area and stay out of the boss' damage zone. (I can give you a spot if you don't know where to go). \n \n> Ignore all beacons the creeper viel will absorb all the damage. \n \n > Enjoy the show!").setColor("BLUE")]})
          await interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${client.emojisObj.animated_tick} Sent slayer survival embed.`)],ephemeral: true})
        }
        break;
        case "frequent-questions": {
          const witherCloakSwordImage = new MessageAttachment("assets/images/wither_cloak_sword.png")
          const goblinArmourImage = new MessageAttachment("assets/images/goblin_armour.png")
          const frequentQuestions = new MessageEmbed().setTitle("__**Frequent Questions**__").setColor("BLUE")
          const whyWitherCloakSword = new MessageEmbed().setTitle("Why wither cloak sword?").setDescription("> The wither cloak sword ability (creeper viel) does not consume mana to toggle but does have a 1s cooldown \n \n> When the ability is active, 6 invisible Charged Creepers surround the player. \n \n > The ability nullifies any damage taken at the cost of 20% of your mana (10% with ultimate wise V) \n \n> This allows you to survive the boss even the beacons of the voidgloom seraph.").setColor("BLUE")
          const whyGoblinArmour = new MessageEmbed().setTitle("Why goblin armour?").setDescription("> Goblin's full set bonus leaves only the player with 100 max mana. \n \n> Since the creeper viel ability takes 20% of your mana per hit nullified (10% with ultimate wise V), it is quicker to regenerate 10 mana rather than for example 1k mana in storm.").setColor("BLUE")
          const whatToDoWhenMini = new MessageEmbed().setTitle("What to do if a miniboss spawns.").setDescription('> Slayer minibosses have a chance to spawn after the player kills the corresponding slayer mob during a slayer quest of Tier III or higher. \n \n > If you are unable to kill the miniboss yourself "/msg [carrier IGN] mini" and the carrier will come to kill it \n \n> As long as you hit it once it will give you the experience.').setColor("BLUE")
          const whatToDoWhenBoss =  new MessageEmbed().setTitle("What to do when the boss spawns.").setDescription("> When the boss spawns \"/msg [carrier IGN] boss\" and the carrier will come to kill it . \n \n > Follow the instructions in <#917063326587031603> to make sure you don't die. \n \n> As long as you hit it once it will give you the experience.").setColor("BLUE")
          const whatToDoIfDeath = new MessageEmbed().setTitle("What to do if you or the carrier die.").setDescription("> If you or the carrier dies, you can either try again or recieve a full refund.").setColor("BLUE")

          await client.channels.cache.get(gChannel.id).send({embeds: [frequentQuestions, whyWitherCloakSword]});
          await client.channels.cache.get(gChannel.id).send({ files: [witherCloakSwordImage]});
          await client.channels.cache.get(gChannel.id).send({embeds: [whyGoblinArmour]});
          await client.channels.cache.get(gChannel.id).send({ files: [goblinArmourImage]});
          await client.channels.cache.get(gChannel.id).send({embeds: [whatToDoWhenMini, whatToDoWhenBoss, whatToDoIfDeath]});

          await interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${client.emojisObj.animated_tick} Sent frequent questions embed.`)],ephemeral: true})

        }
        break;
      }

  },
};
