const Discord = require("discord.js");

module.exports = {
    name: 'cbt',
    description: '',
    execute(message, args) {
        cbtPics = ["https://cdn.discordapp.com/attachments/613703369009135632/636620272451190794/P5txqHSTr1A.jpg",
					 "https://cdn.discordapp.com/attachments/613703369009135632/636618259759628288/oSdOPRKypSc.jpg",]
		const audio = new Discord.MessageAttachment('https://upload.wikimedia.org/wikipedia/commons/4/41/CocknBallTorture.ogg');
		const pic = new Discord.MessageAttachment(cbtPics[Math.floor(Math.random() * cbtPics.length)]);
		message.channel.send(pic)
				.then(() => message.channel.send("Cock and ball torture (CBT) is a sexual activity involving application of pain or constriction to the male genitals. This may involve directly painful activities, such as wax play, genital spanking, squeezing, ball-busting, genital flogging, urethral play, tickle torture, erotic electrostimulation or even kicking."))
                .then(() => message.channel.send(audio));
    },
};