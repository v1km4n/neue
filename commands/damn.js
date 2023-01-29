const Discord = require("discord.js");

module.exports = {
    name: 'damn',
    description: '',
    execute(message, args) {
		message.channel.send(new Discord.MessageAttachment('https://cdn.discordapp.com/attachments/347767925241020426/677908852233994250/0_Ji8-YET7M.png'));
    },
};