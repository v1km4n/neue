const Discord = require("discord.js");
const playModule = require("../commands/play.js");

module.exports = {
    name: 'wipe',
    description: 'Wipes current queue',
    execute: async (message, args, client, Discord, voiceConnection, streamDispatcher) => {
        const wipe = playModule.wipe(message);
    },
};