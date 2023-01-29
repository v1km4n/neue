const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAMTOKEN);

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
	name: 'leagues',
	description: 'TF2 League Checker',
	execute(message, args, client, Discord) {
        var request = new XMLHttpRequest();
		steam.resolve(args[0]).then(steamID => {			
			let nickName;
			let UGCLink = "https://www.ugcleague.com/players_page.cfm?player_id=" + steamID;
			let RGLLink = "https://rgl.gg/Public/PlayerProfile.aspx?p=" + steamID;
			let ETF2LLink = "none";
			let etf2lPlayerURL = new URL("https://api.etf2l.org/player/") + steamID + (".json");
			request.open('GET', etf2lPlayerURL, false);
			request.send();
			let etf2lPlayer = JSON.parse(request.responseText);
			if (etf2lPlayer.status.code == 200) { //if given steamid has an ETF2L profile, parse their nickname
				ETF2LLink = "https://etf2l.org/forum/user/" + etf2lPlayer.player.id;
				nickName = etf2lPlayer.player.name;
			}
			steam.getUserSummary(steamID).then(summary => { 
				if (nickName === undefined) nickName = summary.nickname;
				var embedWithLeaguesLinks = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`League Links for **${nickName}**`)
					.setThumbnail(summary.avatar.large)
					.addFields(
						{ name: '**ETF2L**', value: ETF2LLink},
						{ name: '**UGC**', value: UGCLink},
						{ name: '**RGL**', value: RGLLink},
						)
				message.channel.send(embedWithLeaguesLinks);
			});	
		});
	},
};