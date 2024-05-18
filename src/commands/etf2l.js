const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const steamapi = require('steamapi');
const steam = new steamapi(process.env.STEAMTOKEN);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('etf2l')
		.setDescription('Parse ETF2L profile')
		.addStringOption(option =>
            option.setName('link')
                .setDescription('Steam profile link')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const link = interaction.options.getString('link');
		try {
			const steamId = await steam.resolve(link);
			const request = new XMLHttpRequest();
			request.open('GET', new URL(`https://api.etf2l.org/player/${steamId}.json`));
			request.send();

			request.onload = async () => {
				const etf2lPlayer = JSON.parse(request.responseText);
				if (etf2lPlayer.status.code !== 200) {
					await interaction.editReply(`> **Error:** No such player on ETF2L`);
				} else {
					let HLTeamNo;
					let sixesTeamNo;
					if (etf2lPlayer.player.teams != null) {
						for (let teamNo = 0; teamNo < Object.keys(etf2lPlayer.player.teams).length; teamNo++) {
							if (etf2lPlayer.player.teams[teamNo].type === "Highlander") {
								HLTeamNo = teamNo;
							} else if (etf2lPlayer.player.teams[teamNo].type === "6v6") {
								sixesTeamNo = teamNo;
							}
						}
					}

					let HLTeam;
					let HLEmbedDescription = 'None';
					if (HLTeamNo !== undefined) {
						HLTeam = gameModeParse(etf2lPlayer, HLTeamNo);
						if (HLTeam.seasonDiv == null) { // team with no seasons played
							HLEmbedDescription = `[${HLTeam.name}](${HLTeam.link})`
						} else { // team with seasons played
							HLEmbedDescription = `[${HLTeam.name}](${HLTeam.link}) | ${HLTeam.seasonName} | ${HLTeam.seasonDiv}`;
						}
					}

					let sixesTeam;
					let sixesEmbedDescription = 'None';
					if (sixesTeamNo !== undefined) {
						sixesTeam = gameModeParse(etf2lPlayer, sixesTeamNo);
						if (sixesTeam.seasonDiv === null) { // team with no seasons played
							sixesEmbedDescription = `[${sixesTeam.name}](${sixesTeam.link})`
						}
						else { // team with seasons played
							sixesEmbedDescription = `[${sixesTeam.name}](${sixesTeam.link}) | ${sixesTeam.seasonName} | ${sixesTeam.seasonDiv}`;
						}
					}

					const ETF2LEmbed = new EmbedBuilder()
						.setColor('#0099ff')
						.setTitle(`ETF2L: ${etf2lPlayer.player.name} (${etf2lPlayer.player.country})`)
						.setDescription(`https://etf2l.org/forum/user/${etf2lPlayer.player.id}`)
						.setThumbnail(etf2lPlayer.player.steam.avatar)
						.addFields(
							{ name: '**6v6**', value: sixesEmbedDescription },
							{ name: '**Highlander**', value: HLEmbedDescription }
						);
					await interaction.editReply({embeds: [ETF2LEmbed]});
				}
			}
		} catch (e) {
			if (e.toString().includes('No match')) await interaction.editReply('> **Error:** No such Steam profile');
			else if (e.toString().includes('Invalid format')) await interaction.editReply('> **Error:** Invalid Steam profile link');
			else await interaction.editReply(`> **Unknown Error:** ${e.toString()}`);
		}
    },
};


//using teamN instead of teamID since it is not an etf2l id of a team but rather a number of a team in the player team history
function gameModeParse (etf2lPlayer, teamN) {
	let team = etf2lPlayer.player.teams[teamN];
	let teamSeasons = etf2lPlayer.player.teams[teamN].competitions;
	let teamSeasonsN = 0;
	if (teamSeasons != null) {
		teamSeasonsN = Object.keys(etf2lPlayer.player.teams[teamN].competitions).length;
	}
	let latestSeason = null;

	//unfortunately we cannot be sure that if a team has any seasons played then we have a season to parse, since what we wanna parse should not be playoffs or a preseason
	//and they both count as a separate seasons in the team history

	let checkedSeason = null;
	for (let i = 0; i < teamSeasonsN; i++) {
		checkedSeason = Object.keys(teamSeasons)[teamSeasonsN - i - 1];
		if ((!teamSeasons[checkedSeason].competition.includes("Qualifiers")) && (!teamSeasons[checkedSeason].competition.includes("Playoffs"))) {
			latestSeason = etf2lPlayer.player.teams[teamN].competitions[checkedSeason];
			break; 
			//found the latest season that is not qualifiers of playoffs
		}
	}

	const result = {}; //result represents a team with name, link, and the latest played season's div and name

	result.name = team.name;
	result.link = `https://etf2l.org/teams/${team.id}`;

	if (latestSeason == null) { // team has not participated in any seasons
		result.seasonName = null;
		result.seasonDiv = null;
	} else {
		result.seasonName = latestSeason.competition;
		result.seasonDiv = latestSeason.division.name;
	}

	return result;
}
