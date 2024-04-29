const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const pics = [
	"https://cdn.discordapp.com/attachments/613703369009135632/636620272451190794/P5txqHSTr1A.jpg",
	"https://cdn.discordapp.com/attachments/613703369009135632/636618259759628288/oSdOPRKypSc.jpg"
];
// TODO: use imgur to host images
const audio = 'https://upload.wikimedia.org/wikipedia/commons/4/41/CocknBallTorture.ogg';

module.exports = {
    data: new SlashCommandBuilder()
		.setName('cbt')
		.setDescription('CBT'),
	async execute(interaction){
		const text = 'Cock and ball torture (CBT) is a sexual activity involving application of ' +
			'pain or constriction to the male genitals. This may involve directly painful activities, ' +
			'such as wax play, genital spanking, squeezing, ball-busting, genital flogging, urethral play, ' +
			'tickle torture, erotic electrostimulation or even kicking.';
		const picAttachment = (new AttachmentBuilder(pics[Math.floor(Math.random() * pics.length)])).attachment;
		const audioAttachment = (new AttachmentBuilder(audio)).attachment;

		await interaction.reply(picAttachment);
		await interaction.followUp({
			content: text,
			files: [audioAttachment]
		});
    }
};
