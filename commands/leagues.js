const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAMTOKEN);

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tfl')
		.setDescription('Parse ETF2L, RGL and UGC profiles')
		.addStringOption(option =>
            option.setName('link')
                .setDescription('Steam profile link')
				.setRequired(true)),
	async execute(interaction) {
		const link = interaction.options.getString('link');
		try {
			const steamId = await steam.resolve(link);

			// get etf2l nickname, otherwise use steam nickname
			const request = new XMLHttpRequest();
			request.open('GET', new URL(`https://api.etf2l.org/player/${steamId}.json`));
			request.send();
			request.onload = async () => {
				const etf2lPlayer = JSON.parse(request.responseText);
				let nickname;
				let etf2lLink = 'none';
				if (etf2lPlayer.status.code === 200) {
					nickname = etf2lPlayer.player.name;
					etf2lLink = 'https://etf2l.org/forum/user/' + etf2lPlayer.player.id;
				}

				const summary = await steam.getUserSummary(steamId);
				if (nickname === undefined) nickname = summary.nickname;

				const leaguesEmbed = new EmbedBuilder()
					.setColor('#0099ff')
					.setTitle(`League Links for **${nickname}**`)
					.setThumbnail(summary.avatar.large)
					.addFields(
						{ name: '**ETF2L**', value: etf2lLink},
						{ name: '**UGC**', value: `https://www.ugcleague.com/players_page.cfm?player_id=${steamId}`},
						{ name: '**RGL**', value: `https://rgl.gg/Public/PlayerProfile.aspx?p=${steamId}`}
					);
				interaction.reply({embeds: [leaguesEmbed]});
			}
		} catch (e) {
			if (e.toString().includes('No match')) interaction.reply('> **Error:** No such Steam profile');
			else if (e.toString().includes('Invalid format')) interaction.reply('> **Error:** Invalid Steam profile link');
			else interaction.reply(`> **Unknown Error:** ${e.toString()}`);
		}
	}
};
