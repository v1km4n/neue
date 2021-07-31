const Discord = require("discord.js"); //main discord js api
const tokens = require('../tokens.json');

const SteamAPI = require('steamapi');
const steam = new SteamAPI(tokens.steam);

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
	name: 'steaminfo',
	description: 'Basic Steam information about given user',
	execute(message, args) {
        var request = new XMLHttpRequest();

		steam.resolve(args[0]).then(steamID => {
            let httpRequest = new URL("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=") + tokens.steam + ("&steamids=") + steamID + (".json");            

			request.open('GET', httpRequest, false);
            request.send();
            message.channel.send(request.responseText);
            var httpResponse = JSON.parse(request.responseText);
            message.channel.send(`httprspns ${httpResponse}`);

            //if (args[0].includes("steamcommunity.com/profiles")); //USED STEAMID64
            
            //let profilePictureURL = httpResponse.players[0].avatarfull;
            //message.channel.send(profilePictureURL);
		});
	
    	},
};
