const Discord = require("discord.js");
const playModule = require("../commands/play.js");

module.exports = {
    name: 'skip',
    description: 'Skip one or several tracks in the queue',
    execute: async (message, args, client, Discord, voiceConnection, streamDispatcher) => {
        if (args[0] == undefined) {
            playModule.skip(1, message);
        } else {
            playModule.skip(parseInt(args[0]), message);
        }
    },
};