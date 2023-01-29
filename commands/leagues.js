const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAMTOKEN);

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
	name: 'leagues',
	description: 'TF2 League Checker',
	execute(message, args, client, Discord) 
	{
        var request = new XMLHttpRequest();
		steam.resolve(args[0]).then(steamID => 
		{			
			request.open('GET', new URL(`https://api.etf2l.org/player/${steamID}.json`), false);
			request.send();

			let etf2lLink = "none";
			let etf2lPlayer = JSON.parse(request.responseText);
			if (etf2lPlayer.status.code == 200) 
			{
				etf2lLink = "https://etf2l.org/forum/user/" + etf2lPlayer.player.id;
			}
			steam.getUserSummary(steamID).then(summary => 
			{ 
				var embedWithLeaguesLinks = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`League Links for **${etf2lPlayer.player.name || summary.nickname}**`)
					.setThumbnail(summary.avatar.large)
					.addFields(
						{ name: '**ETF2L**', value: etf2lLink},
						{ name: '**UGC**', value: `https://www.ugcleague.com/players_page.cfm?player_id=${steamID}`},
						{ name: '**RGL**', value: `https://rgl.gg/Public/PlayerProfile.aspx?p=${steamID}`})
				message.channel.send(embedWithLeaguesLinks);
			});	
		});
	},
};