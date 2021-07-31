const Discord = require("discord.js");
const ytdl = require('ytdl-core-discord');
const ytpl = require('ytpl');

var startVolume = 0.5;
var voiceConnection;
var streamDispatcher;
var logChannel;
var queue = [];

module.exports = {
    currentVolume: async(message) => {
        message.channel.send(`Current volume is ${startVolume*100}%`);
    },
    name: 'play',
    description: 'plays music',
    execute: async(message, args, client, Discord) => {
        if (message.member.voice.channel) {
            logChannel = message.channel;

            if ( args[0].includes( "playlist" ) ) { //assuming this is a yt playlist
                var playlist = await ytpl( args[0] );
            
                for (let i = 0; i < Object.keys( playlist.items ).length; i++) {
                    let queueItem = {
                        url: playlist.items[i].shortUrl,
                        title: playlist.items[i].title,
                        requester: message.author.username
                    }
                    queue.push(queueItem);
                    
                }
                message.channel.send(`**Playlist** requested by **${message.author.username}** has been added to the queue`);

            } else if ( args[0].includes( "watch" ) ) { //and this is a normal yt video
                var videoInfo = await ytdl.getBasicInfo(args[0]);
                let queueItem = {
                    url: args[0],
                    title: videoInfo.videoDetails.title,
                    requester: message.author.username
                }
                message.channel.send(`**${queueItem.title}** requested by **${queueItem.requester}** has been added to the queue`);
                queue.push(queueItem);
            }

            voiceConnection = await message.member.voice.channel.join();

            if (!streamDispatcher) play();
        } else {
            message.channel.send("You must be in a voice channel to run this command!");
        }
    },
    volume: async(volume) => {
        startVolume = volume;
        if (streamDispatcher) streamDispatcher.setVolume(volume); 
    },
    pause: async() => {
        streamDispatcher.pause();
    },
    resume: async() => {
        streamDispatcher.resume();
    },
    leave: async() => {
        voiceConnection.disconnect();
        queue = [];
    },
    queue: async(message) => {
        if (queue.length == 0) {
            message.channel.send("Queue is empty!");
        } else {
            let reply = `\`\`\``;
            for (let i = 0; i < queue.length; i++) {
                reply += `${i + 1} | ${queue[i].title} | ${queue[i].requester} \n`;
            }
            reply += `\`\`\``;
            message.channel.send(reply);
        }
    },
    wipe: async(message) => {
        queue = [];
        message.channel.send("Queue has been wiped!");
        onFinish();
    },
    skip: async(skip, message) => {
        if (skip > queue.length) {
            message.channel.send("You're trying to skip more tracks than there is in the queue");
        } else for (let i = 1; i < skip; i++) queue.shift();
        onFinish();
    }
};

async function play() {

    streamDispatcher = voiceConnection.play( await ytdl( queue[0].url ), { type: 'opus', volume: startVolume } );

    streamDispatcher.on('start', () => {
        logChannel.send(`Playing **${queue[0].title}** requested by **${queue[0].requester}**`);
    });

    streamDispatcher.on('error', (error) => {
        console.log(error);
    });

    streamDispatcher.on('finish', () => {
        onFinish();
    });
}

async function onFinish() {
    queue.shift();
    if (queue.length != 0) {
        play();
    } else {
        logChannel.send("Queue is empty, leaving!");
        streamDispatcher = null;
        voiceConnection.disconnect();
    }
}