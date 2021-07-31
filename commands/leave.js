const Discord = require("discord.js");
const playModule = require("../commands/play.js");

module.exports = {
    name: 'leave',
    description: 'Makes bot leave the current voice channel',
    execute: async (message, args, client, Discord, voiceConnection, streamDispatcher) => {
        if (message.member.voice.channel) {
            message.react('👋');
            const leave = playModule.leave();
        } else {
            message.channel.send("You must be in a voice channel to run this command!");
        }
    },
};