const Discord = require("discord.js");
const playModule = require("../commands/play.js");

module.exports = {
    name: 'pause',
    description: 'Pauses the stream',
    execute: async (message, args, client, Discord, voiceConnection, streamDispatcher) => {
        const pause = playModule.pause();
    },
};