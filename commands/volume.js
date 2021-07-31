const Discord = require("discord.js");
const playModule = require("../commands/play.js");

module.exports = {
    name: 'volume',
    description: 'Controls the volume of stream dispatcher',
    execute: async (message, args, client, Discord, voiceConnection, streamDispatcher) => {
        if (args[0] == undefined) {
            playModule.currentVolume(message);
        } else {
            var volume = parseInt(args[0]);
            if (( volume > 100 ) || ( volume < 0 ) ) {
                message.channel.send("Usage !volume [0-100]");
            } else {
                volume = volume / 100;
                message.channel.send(`Setting volume to ${args[0]}%`);
                var volume = playModule.volume(volume);
            }
        }
    },
};