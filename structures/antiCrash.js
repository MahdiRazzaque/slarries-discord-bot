const chalk = require("chalk");
const { error_logs_id } = require('./config.json')
const { MessageEmbed, WebhookClient } = require('discord.js')
const { inspect } = require("util")

const channel = new WebhookClient({url: "https://discord.com/api/webhooks/961270146222153809/iR6wk6DW-St8eOlGv0nXN4h9ge2fVf8em5ComG0mwggFQLANRA3oBUb-jEwT5GD4FnX_"})


module.exports = (client) => {
    client.on('error', err => {
        console.log(err)
        const ErrorEmbed = new MessageEmbed()
            .setTitle('Error')
            .setColor('#2F3136')
            .setDescription(`\`\`\`${inspect(error, {depth: 0})}\`\`\``)
            .setTimestamp()
        
        // const channel = client.channels.cache.get(error_logs_id)
        return channel.send({ embeds: [ErrorEmbed] })
    });
    process.on("unhandledRejection", (reason, p) => {
        console.log(chalk.yellow('——————————[Unhandled Rejection/Catch]——————————\n'), reason, p)
        const unhandledRejectionEmbed = new MessageEmbed()
            .setTitle('Unhandled Rejection/Catch')
            .setColor('RED')
            .addField('Reason', `\`\`\`${inspect(reason, { depth: 0 }).substring(0, 1000)}\`\`\``)
            .addField('Promise', `\`\`\`${inspect(p, { depth: 0 }).substring(0, 1000)}\`\`\``)
            .setTimestamp()
        
        // const channel = client.channels.cache.get(error_logs_id)
        return channel.send({ embeds: [unhandledRejectionEmbed] })
    });
    
    process.on("uncaughtException", (err, origin) => {
        console.log(err, origin)
        const uncaughtExceptionEmbed = new MessageEmbed()
            .setTitle('Uncaught Exception/Catch')
            .setColor('RED')
            .addField('Error', `\`\`\`${inspect(err, { depth: 0 }).substring(0, 1000)}\`\`\``)
            .addField('Origin', `\`\`\`${inspect(origin, { depth: 0 }).substring(0, 1000)}\`\`\``)
            .setTimestamp()

        // const channel = client.channels.cache.get(error_logs_id)
        return channel.send({ embeds: [uncaughtExceptionEmbed] })
    });
    
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log(err, origin)
        const uncaughtExceptionMonitorEmbed = new MessageEmbed()
            .setTitle('Uncaught Exception Monitor')
            .setColor('RED')
            .addField('Error', `\`\`\`${inspect(err, { depth: 0 }).substring(0, 1000)}\`\`\``)
            .addField('Origin', `\`\`\`${inspect(origin, { depth: 0 }).substring(0, 1000)}\`\`\``)
            .setTimestamp()
        
        // const channel = client.channels.cache.get(error_logs_id)
        return channel.send({ embeds: [uncaughtExceptionMonitorEmbed] })
    });
    
    process.on("multipleResolves", (type, promise, reason) => {
        console.log(type, promise, reason)
        const multipleResolvesEmbed = new MessageEmbed()
            .setTitle('Multiple Resolves')
            .setColor('RED')
            .addField('Type', `\`\`\`${inspect(type, { depth: 0 }).substring(0, 1000)}\`\`\``)
            .addField('Promise', `\`\`\`${inspect(promise, { depth: 0 }).substring(0, 1000)}\`\`\``)
            .addField('Reason', `\`\`\`${inspect(reason, { depth: 0 }).substring(0, 1000)}\`\`\``)
            .setTimestamp()

        // const channel = client.channels.cache.get(error_logs_id)
        return channel.send({ embeds: [multipleResolvesEmbed] })
    });
    
    process.on("warning", (warn) => {
        if(warn.message.includes("DisTubeOptions.youtubeDL is deprecated")) return;
        console.log(warn)
        const warningEmbed = new MessageEmbed()
            .setTitle('Warning')
            .setColor('RED')
            .addField('Warn', `\`\`\`${inspect(warn, { depth: 0 }).substring(0, 1000)}\`\`\``)
            .setTimestamp()

        // const channel = client.channels.cache.get(error_logs_id)
        return channel.send({ embeds: [warningEmbed] })
    });  
}