const { REST, Routes } = require('discord.js');
const { clientId } = require('./config.json');
const fs = require('node:fs');
const process = require("process");

const commands = [];

const commandsDir = './commands'
const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
for (const commandFile of commandFiles) {
	const commandPath = commandsDir.concat('/').concat(commandFile)
	const command = require(commandPath);
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	}
}

const rest = new REST().setToken(process.env.token);
(async () => {
	try {
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
	} catch (error) {
		console.error(error);
	}
})();

console.log(`Registered ${commands.length} commands`);

// in case I need to delete some command
// rest.delete(Routes.applicationCommand(clientId, commandId));
