const process = require('process');
const Discord = require("discord.js"); //main discord js api

module.exports = {
	name: 'uptime',
    description: 'Bot uptime',
    execute(message, args) {
		message.channel.send(`${ Math.floor( process.uptime() ) } second(s) on ${ process.platform }`);
    },
}