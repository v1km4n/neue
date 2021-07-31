const Discord = require("discord.js");

module.exports = {
    name: 'wise',
    description: '',
    execute(message, args) {
        const attachment = new Discord.MessageAttachment('https://i.imgur.com/pLRMvCr.jpg');
        message.channel.send(attachment);
    },
};