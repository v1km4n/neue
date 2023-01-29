const Discord = require("discord.js");

module.exports = {
    name: 'wise',
    description: '',
    execute(message, args) {
        message.channel.send(new Discord.MessageAttachment('https://i.imgur.com/pLRMvCr.jpg'));
    },
};