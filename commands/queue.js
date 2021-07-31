const Discord = require("discord.js");
const playModule = require("../commands/play.js");

module.exports = {
    name: 'queue',
    description: 'Displays current queue',
    execute: async (message, args, client, Discord, voiceConnection, streamDispatcher) => {
        const queue = playModule.queue(message);
    },
};