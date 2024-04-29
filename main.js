const process = require('process');
const discordIDs = require("./config.json");
const fs = require('node:fs');

// 	// if (message.content.toLowerCase().includes("блины") || message.content.toLowerCase().includes("блинов") ||
// 	// 	message.content.toLowerCase().includes("блинам") || message.content.toLowerCase().includes("блинами") ||
// 	// 	message.content.toLowerCase().includes("блинах") || message.content.toLowerCase().includes("blini")) {
// 	// 	const catWithPancakes = new Discord.MessageAttachment("https://i.imgur.com/L4QqeEF.jpeg");
// 	// 	message.channel.send(catWithPancakes)
// 	// 		.then(() => message.channel.send("KTO-TO SKAZAL BLINI?"));
// 	// }
// 	// prolly some part of messageattachment api got deprecated
// 	// the only fix is to update to a discordjs version

const { ActivityType, AttachmentBuilder, Client, Collection, Events, GatewayIntentBits  } = require('discord.js');
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.MessageContent]
});
const token = process.env.token;

client.commands = new Collection();
const commandsDir = './commands'
const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
for (const commandFile of commandFiles) {
	const commandPath = commandsDir.concat('/').concat(commandFile)
	const command = require(commandPath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
}

client.on(Events.MessageCreate, async message => {
	if (message.author.bot) return;
	if (message.content.toLowerCase().includes("блины") || message.content.toLowerCase().includes("блинов") ||
		message.content.toLowerCase().includes("блинам") || message.content.toLowerCase().includes("блинами") ||
		message.content.toLowerCase().includes("блинах") || message.content.toLowerCase().includes("blini")) {
		const catWithPancakes = (new AttachmentBuilder('https://i.imgur.com/L4QqeEF.jpeg')).attachment;
		message.channel.send({files: [catWithPancakes]})
			.then(() => message.channel.send("KTO-TO SKAZAL BLINI?"));
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.once(Events.ClientReady, () => {
	client.user.setStatus('online');
	client.user.setActivity('Team Fortress 2', {
		type: ActivityType.Streaming,
		url: 'https://www.twitch.tv/v1km4n'
	});
});

client.login(token);
