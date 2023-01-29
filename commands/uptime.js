const process = require('process');

module.exports = 
{
	name: 'uptime',
    description: 'Bot uptime',
    execute(message, args) 
    {
		message.channel.send(`I've been running for ${ Math.floor( process.uptime() ) } second(s) on ${ process.platform }`);
    },
}