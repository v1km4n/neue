const Discord = require("discord.js"); //main discord js api

const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAMTOKEN);

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
	name: 'etf2l',
	description: 'ETF2L League Checker',
	execute(message, args) {
		steam.resolve(args[0]).then(steamID => {
			var request = new XMLHttpRequest();
			request.open('GET', new URL(`https://api.etf2l.org/player/${steamID}.json`), false);
			request.send();

			var etf2lPlayer = JSON.parse(request.responseText);
			if (etf2lPlayer.status.code == 200) 
			{
				var HLTeamNo;
				var sixesTeamNo;
				if (etf2lPlayer.player.teams != null) 
				{
					for (let i = 0; i < Object.keys(etf2lPlayer.player.teams).length; i++) 
					{
						if (etf2lPlayer.player.teams[i].type == "Highlander") 
						{ 
							HLTeamNo = i;
						} 
						else if (etf2lPlayer.player.teams[i].type == "6on6") 
						{
							sixesTeamNo = i;
						} 
					}
				}

				var HLTeam;
				if (HLTeamNo != undefined)
				{
					HLTeam = gameModeParse(etf2lPlayer, HLTeamNo);
				}

				if (HLTeamNo == undefined) //no team
				{
					var HLEmbedDescription = "None";
				} 
				else if (HLTeam.seasonDiv == null) //team with no seasons played
				{
					var HLEmbedDescription = `${HLTeam.name} | ${HLTeam.link}`
				} 
				else if (HLTeam.seasonDiv != null) //team with seasons played
				{
					var HLEmbedDescription = `${HLTeam.name} | ${HLTeam.link}\n${HLTeam.seasonName} | ${HLTeam.seasonDiv}`;
				}

				var sixesTeam;
				if (sixesTeamNo != undefined)
				{
					sixesTeam = gameModeParse(etf2lPlayer, sixesTeamNo);
				}

				if (sixesTeamNo == undefined) //no team
				{
					var sixesEmbedDescription = "None";
				} 
				else if (sixesTeam.seasonDiv == null) //team with no seasons played
				{
					var sixesEmbedDescription = `${sixesTeam.name} | ${sixesTeam.link}`
				} 
				else if (sixesTeam.seasonDiv != null) //team with seasons played
				{
					var sixesEmbedDescription = `${sixesTeam.name} | ${sixesTeam.link}\n${sixesTeam.seasonName} | ${sixesTeam.seasonDiv}`;
				}
								
				var ETF2LEmbed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`ETF2L: ${etf2lPlayer.player.name} (${etf2lPlayer.player.country})`)
					.setDescription(`https://etf2l.org/forum/user/${etf2lPlayer.player.id}`)
					.setThumbnail(etf2lPlayer.player.steam.avatar)
					.addFields(
						{ name: '**6v6**', value: sixesEmbedDescription},
						{ name: '**Highlander**', value: HLEmbedDescription},
					)
				message.channel.send(ETF2LEmbed);
			} 
			else 
			{
				message.channel.send("This Steam account is not associated with an ETF2L profile");
			}
		});
    },
};


//using teamN instead of teamID since it is not an etf2l id of a team but rather a number of a team in the player team history
function gameModeParse (etf2lPlayer, teamN) 
{
	let team = etf2lPlayer.player.teams[teamN];
	let teamSeasons = etf2lPlayer.player.teams[teamN].competitions;
	let teamSeasonsN = 0;
	if (teamSeasons != null) 
	{
		teamSeasonsN = Object.keys(etf2lPlayer.player.teams[teamN].competitions).length;
	}
	let latestSeason = null;

	//unfortunately we cannot be sure that if a team has any seasons played then we have a season to parse, since what we wanna parse should not be playoffs or a preseason
	//and they both count as a separate seasons in the team history

	let checkedSeason = null;
	for (let i = 0; i < teamSeasonsN; i++) 
	{
		checkedSeason = Object.keys(teamSeasons)[teamSeasonsN - i - 1];
		if ((!teamSeasons[checkedSeason].competition.includes("Qualifiers")) && (!teamSeasons[checkedSeason].competition.includes("Playoffs"))) 
		{
			latestSeason = etf2lPlayer.player.teams[teamN].competitions[checkedSeason];
			break; 
			//found the latest season that is not qualifiers of playoffs
		}
	}

	var result = new Object();
	//result represents a team with name, link, and the latest played season's div and name

	result.name = team.name;
	result.link = `https://etf2l.org/teams/${team.id}`;

	if (latestSeason == null) // team has not participated in any seasons
	{
		result.seasonName = null;
		result.seasonDiv = null;
	} 
	else 
	{
		result.seasonName = latestSeason.competition;
		result.seasonDiv = latestSeason.division.name;
	}

	return result;
}