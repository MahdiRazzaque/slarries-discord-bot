const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { DiscordTogether } = require("discord-together");
const { fun_embed_colour } = require("../../structures/config.json")


module.exports = {
    name: "discord-together",
    description: "discord together activities",
    usage: "/discord-together",
    disabled: false,
    botCommandChannelOnly: true,
    options: [
        {
            name: "activity",
            description: "select the activity",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "youtube",
                    value: "youtube"
                },
                {
                    name: "chess",
                    value: "chess"
                },
                {
                    name: "betrayal",
                    value: "betrayal"
                },
                {
                    name: "poker",
                    value: "poker"
                },
                {
                    name: "fish",
                    value: "fish"
                },
                {
                    name: "lettertile",
                    value: "lettertile"
                },
                {
                    name: "word_snack",
                    value: "word_snack"
                },
                {
                    name: "doodle_crew",
                    value: "doodle_crew"
                },
                {
                    name: "spell_cast",
                    value: "spell_cast"
                },
                {
                    name: "awkword",
                    value: "awkword"
                },
                {
                    name: "puttparty",
                    value: "puttparty"
                },
            ]

        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const choices = interaction.options.getString("activity");
        const { options, member, guild, channel } = interaction;

        const Response = new MessageEmbed().setColor(fun_embed_colour)

        switch(choices) {
            case "youtube": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({embeds: [Response.setColor("RED").setDescription(`<a:animated_cross:925091847905366096> Please connect to a vc to generate your Youtube-together link`)], ephemeral: true})
        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'youtube').then(async invite => {
                    interaction.reply({embeds: [Response.setTitle("Discord Together").setDescription(`<a:animated_tick:925091839030231071> Press on the link to join the activity!`)], content: `${invite.code}`})
                })

            }
            break;
            case "chess": {
                const invc = member.voice.channel;
                
                if(!invc) return interaction.reply({embeds: [Response.setColor("RED").setDescription(`<a:animated_cross:925091847905366096> Please connect to a vc to generate your chess-together link`)], ephemeral: true})

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'chess').then(async invite => {
                    interaction.reply({embeds: [Response.setTitle("Discord Together").setDescription(`<a:animated_tick:925091839030231071> Press on the link to join the activity!`)], content: `${invite.code}`})
                })

            }
            break;
            case "betrayal": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({embeds: [Response.setColor("RED").setDescription(`<a:animated_cross:925091847905366096> Please connect to a vc to generate your betrayal-together link`)], ephemeral: true})

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'betrayal').then(async invite => {
                    interaction.reply({embeds: [Response.setTitle("Discord Together").setDescription(`<a:animated_tick:925091839030231071> Press on the link to join the activity!`)], content: `${invite.code}`})
                })

            }
            break;
            case "poker": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({embeds: [Response.setColor("RED").setDescription(`<a:animated_cross:925091847905366096> Please connect to a vc to generate your poker-together link`)], ephemeral: true})

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'poker').then(async invite => {
                    interaction.reply({embeds: [Response.setTitle("Discord Together").setDescription(`<a:animated_tick:925091839030231071> Press on the link to join the activity!`)], content: `${invite.code}`})
                })

            }
            break;
            case "fish": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({embeds: [Response.setColor("RED").setDescription(`<a:animated_cross:925091847905366096> Please connect to a vc to generate your fishing-together link`)], ephemeral: true})

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'fishing').then(async invite => {
                    interaction.reply({embeds: [Response.setTitle("Discord Together").setDescription(`<a:animated_tick:925091839030231071> Press on the link to join the activity!`)], content: `${invite.code}`})
                })

            }
            break;
            case "lettertile": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({embeds: [Response.setColor("RED").setDescription(`<a:animated_cross:925091847905366096> Please connect to a vc to generate your lettertile-together link`)], ephemeral: true})

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'lettertile').then(async invite => {
                    interaction.reply({embeds: [Response.setTitle("Discord Together").setDescription(`<a:animated_tick:925091839030231071> Press on the link to join the activity!`)], content: `${invite.code}`})
                })

            }
            break;
            case "word_snack": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({embeds: [Response.setColor("RED").setDescription(`<a:animated_cross:925091847905366096> Please connect to a vc to generate your wordsnack-together link`)], ephemeral: true})

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'wordsnack').then(async invite => {
                    interaction.reply({embeds: [Response.setTitle("Discord Together").setDescription(`<a:animated_tick:925091839030231071> Press on the link to join the activity!`)], content: `${invite.code}`})
                })

            }
            break;
            case "doodle_crew": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({embeds: [Response.setColor("RED").setDescription(`<a:animated_cross:925091847905366096> Please connect to a vc to generate your doodlecrew-together link`)], ephemeral: true})

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'doodlecrew').then(async invite => {
                    interaction.reply({embeds: [Response.setTitle("Discord Together").setDescription(`<a:animated_tick:925091839030231071> Press on the link to join the activity!`)], content: `${invite.code}`})
                })

            }
            break;
            case "spell_cast": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({embeds: [Response.setColor("RED").setDescription(`<a:animated_cross:925091847905366096> Please connect to a vc to generate your spellcast-together link`)], ephemeral: true})

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'spellcast').then(async invite => {
                    interaction.reply({embeds: [Response.setTitle("Discord Together").setDescription(`<a:animated_tick:925091839030231071> Press on the link to join the activity!`)], content: `${invite.code}`})
                })

            }
            break;
            case "awkword": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({embeds: [Response.setColor("RED").setDescription(`<a:animated_cross:925091847905366096> Please connect to a vc to generate your awkword-together link`)], ephemeral: true})

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'awkword').then(async invite => {
                    interaction.reply({embeds: [Response.setTitle("Discord Together").setDescription(`<a:animated_tick:925091839030231071> Press on the link to join the activity!`)], content: `${invite.code}`})
                })

            }
            break;
            case "puttparty": {
                const invc = member.voice.channel;

                if(!invc) return interaction.reply({embeds: [Response.setColor("RED").setDescription(`<a:animated_cross:925091847905366096> Please connect to a vc to generate your puttparty-together link`)], ephemeral: true})

        
                client.discordTogether.createTogetherCode(interaction.member.voice.channelId, 'puttparty').then(async invite => {
                    interaction.reply({embeds: [Response.setTitle("Discord Together").setDescription(`<a:animated_tick:925091839030231071> Press on the link to join the activity!`)], content: `${invite.code}`})
                })

            }
            break;
            
        }

    },
};