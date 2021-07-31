const Discord = require("discord.js"); //main discord js api
const tokens = require('../tokens.json');

const SteamAPI = require('steamapi');
const steam = new SteamAPI(tokens.steam);

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
	name: 'etf2l',
	description: 'ETF2L League Checker',
	execute(message, args) {
        var request = new XMLHttpRequest();
		var ETF2LLink;

		steam.resolve(args[0]).then(steamID => {
			//ETF2L

			let etf2lPlayerURL = new URL("https://api.etf2l.org/player/") + steamID + (".json");
			request.open('GET', etf2lPlayerURL, false);
			request.send();

			var etf2lPlayer = JSON.parse(request.responseText);

			if (etf2lPlayer.status.code == 200) {
				let ETF2LID = etf2lPlayer.player.id;
				let ETF2LNickName = etf2lPlayer.player.name;
				ETF2LLink = "https://etf2l.org/forum/user/" + ETF2LID;
				let ETF2LProfilePicture = etf2lPlayer.player.steam.avatar;

				var HLTeamNo = null;
				var SixesTeamNo = null;

				var HLTeamLink = null;
				var HLTeamDiv = null;
				var HLTeamName = null;
				var HLTeamCompetititonName = null;

				var SixesTeamLink = null;
				var SixesTeamDiv = null;
				var SixesTeamName = null;
				var SixesTeamCompetititonName = null;


				if (etf2lPlayer.player.teams != null) {
					for (let i = 0; i < Object.keys(etf2lPlayer.player.teams).length; i++) {
						if (etf2lPlayer.player.teams[i].type == "Highlander") { 
							HLTeamNo = i;
						} else if (etf2lPlayer.player.teams[i].type == "6on6") {
							SixesTeamNo = i;
						} 
					}
				}

				if (HLTeamNo != null) {
					let latestSeasonID = null;
					let checkedSeason = null;

					let team = etf2lPlayer.player.teams[HLTeamNo];
					let listofHLTeamSeasons = etf2lPlayer.player.teams[HLTeamNo].competitions;
					let amountofHLTeamSeasons = Object.keys(etf2lPlayer.player.teams[HLTeamNo].competitions).length;
					let latestSeason = null; //meaning the JSON part of the season we are about to get info about

					HLTeamLink = "https://etf2l.org/teams/" + team.id;
					HLTeamName = team.name;

					for (let i = 0; i < amountofHLTeamSeasons; i++) {
						checkedSeason = Object.keys(listofHLTeamSeasons)[amountofHLTeamSeasons - i - 1];
						if ((!listofHLTeamSeasons[checkedSeason].competition.includes("Qualifiers")) && 
							(!listofHLTeamSeasons[checkedSeason].competition.includes("Playoffs"))) {
							latestSeasonID = checkedSeason;
							latestSeason = etf2lPlayer.player.teams[HLTeamNo].competitions[latestSeasonID];
							break; //found the latest HL season that is not qualifiers of playoffs, since those don't have the division argument
						}
					}

					if (latestSeasonID == null) {
						HLTeamCompetititonName = null;
						HLTeamDiv = null;
					} else { //TODO: add check for the player match history rather than division of the current team
						if ((latestSeason.division.name == null)) { //for those HL seasons, where open division was basically a complete different season
							let colonIndex = latestSeason.competition.indexOf(':'); //we need this to find colon in string like "Highlander Season 18: Open" and the slice the ": Open" part off
							HLTeamCompetititonName = latestSeason.competition.slice(0, colonIndex); //"Highlander Season 18: Open" -> "Highlander Season 18"
							HLTeamDiv = "Open";
						} else { //now for the usual seasons
							HLTeamDiv = latestSeason.division.name;
							HLTeamCompetititonName = latestSeason.competition;
						}
					}
					
				} else {
					HLTeamLink = null;
				}

				if (SixesTeamNo != null) {
					let latestSeasonID = null;
					let checkedSeason = null;


					let team = etf2lPlayer.player.teams[SixesTeamNo];
					let listofSixesTeamSeasons = etf2lPlayer.player.teams[SixesTeamNo].competitions;
					let amountofSixesTeamSeasons = Object.keys(etf2lPlayer.player.teams[SixesTeamNo].competitions).length;
					let latestSeason = null;

					SixesTeamLink = "https://etf2l.org/teams/" + team.id;
					SixesTeamName = team.name;

					for (let i = 0; i < amountofSixesTeamSeasons; i++) {
						checkedSeason = Object.keys(listofSixesTeamSeasons)[amountofSixesTeamSeasons - i - 1];
						if ((!listofSixesTeamSeasons[checkedSeason].competition.includes("Qualifiers")) && 
							(!listofSixesTeamSeasons[checkedSeason].competition.includes("Playoffs"))) {
							latestSeasonID = checkedSeason;
							latestSeason = etf2lPlayer.player.teams[SixesTeamNo].competitions[latestSeasonID];
							break;
						}
					}

					if (latestSeasonID == null) {
						SixesTeamCompetititonName = null;
						SixesTeamDiv = null;
					} else { //TODO: add check for the player match history rather than division of the current team
						if ((latestSeason.division.name == null)) { //for those HL seasons, where open division was basically a complete different season
							let colonIndex = latestSeason.competition.indexOf(':'); //we need this to find colon in string like "Highlander Season 18: Open" and the slice the ": Open" part off
							SixesTeamCompetititonName = latestSeason.competition.slice(0, colonIndex); //"Highlander Season 18: Open" -> "Highlander Season 18"
							SixesTeamDiv = "Open";
						} else { //now for the usual seasons
							SixesTeamDiv = latestSeason.division.name;
							SixesTeamCompetititonName = latestSeason.competition;
						}
					}
					
				} else {
					SixesTeamLink = null;
				}

				// EMBED PREVIEW
				// ETF2L Info for the ${ETF2LNickName}
				// 
				// Profile Link
				// ${ETF2LLink}
				//
				// 6v6 Team		
				// ${SixesTeamName} | ${SixesTeamLink}											
				// ${SixesTeamCompetititonName} | ${SixesTeamDiv}
				// 
				// HL Team
				// ${HLTeamName} | ${HLTeamLink}
				// ${HLTeamCompetititonName} | ${HLTeamDiv}

				let SixesEmbedDescription;
				if (SixesTeamLink == null) {
					SixesEmbedDescription = "None";
				} else if (SixesTeamDiv == null) {
					SixesEmbedDescription = `${SixesTeamName} | ${SixesTeamLink}`
				} else if (SixesTeamDiv != null) {
					SixesEmbedDescription = `${SixesTeamName} | ${SixesTeamLink}\n${SixesTeamCompetititonName} | ${SixesTeamDiv}`;
				} else {
					SixesEmbedDescription = `Unknown error has occured *shrug*`;
				}

				let HLEmbedDescription;
				if (HLTeamLink == null) {
					HLEmbedDescription = "None";
				} else if (HLTeamDiv == null) {
					HLEmbedDescription = `${HLTeamName} | ${HLTeamLink}`
				} else if (HLTeamDiv != null) {
					HLEmbedDescription = `${HLTeamName} | ${HLTeamLink}\n${HLTeamCompetititonName} | ${HLTeamDiv}`;
				} else {
					HLEmbedDescription = `Unknown error has occured *shrug*`;
				}
				
				var ETF2LEmbed = new Discord.MessageEmbed()

					.setColor('#0099ff')
					.setTitle(`ETF2L info for ${ETF2LNickName}`)
					.setDescription(ETF2LLink)
					.setThumbnail(ETF2LProfilePicture)
					.addFields(
						{ name: '**6v6 Team**', value: SixesEmbedDescription},
						{ name: '**HL Team**', value: HLEmbedDescription},
					)
				message.channel.send(ETF2LEmbed);
			} else {
				message.channel.send("No such player on ETF2L");
			}
			
		});
	
    	},
};

function gameModeParse (gameMode, player) {
	let latestSeasonID = null;
	let checkedSeason = null;

	let team = etf2lPlayer.player.teams[HLTeamNo];
	let listofHLTeamSeasons = etf2lPlayer.player.teams[HLTeamNo].competitions;
	let amountofHLTeamSeasons = Object.keys(etf2lPlayer.player.teams[HLTeamNo].competitions).length;
	let latestSeason = null; //meaning the JSON part of the season we are about to get info about

	HLTeamLink = "https://etf2l.org/teams/" + team.id;
	HLTeamName = team.name;

	for (let i = 0; i < amountofHLTeamSeasons; i++) {
		checkedSeason = Object.keys(listofHLTeamSeasons)[amountofHLTeamSeasons - i - 1];
		if ((!listofHLTeamSeasons[checkedSeason].competition.includes("Qualifiers")) && 
			(!listofHLTeamSeasons[checkedSeason].competition.includes("Playoffs"))) {
			latestSeasonID = checkedSeason;
			latestSeason = etf2lPlayer.player.teams[HLTeamNo].competitions[latestSeasonID];
			break; //found the latest HL season that is not qualifiers of playoffs, since those don't have the division argument
		}
	}

	if (latestSeasonID == null) {
		HLTeamCompetititonName = null;
		HLTeamDiv = null;
	} else { //TODO: add check for the player match history rather than division of the current team
		if ((latestSeason.division.name == null)) { //for those HL seasons, where open division was basically a complete different season
			let colonIndex = latestSeason.competition.indexOf(':'); //we need this to find colon in string like "Highlander Season 18: Open" and the slice the ": Open" part off
			HLTeamCompetititonName = latestSeason.competition.slice(0, colonIndex); //"Highlander Season 18: Open" -> "Highlander Season 18"
			HLTeamDiv = "Open";
		} else { //now for the usual seasons
			HLTeamDiv = latestSeason.division.name;
			HLTeamCompetititonName = latestSeason.competition;
		}
	}
}