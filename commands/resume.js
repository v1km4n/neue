const Discord = require("discord.js");
const playModule = require("./play.js");

module.exports = {
    name: 'resume',
    description: 'Resumes the stream',
    execute: async (message, args, client, Discord, voiceConnection, streamDispatcher) => {
        const pause = playModule.resume();
    },
};