const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const pics = [
	"https://i.imgur.com/wZvtbWd.jpeg",
	"https://i.imgur.com/8OhzCBd.jpeg"
];
const audio = 'https://upload.wikimedia.org/wikipedia/commons/4/41/CocknBallTorture.ogg';

module.exports = {
    data: new SlashCommandBuilder()
		.setName('cbt')
		.setDescription('CBT'),
	async execute(interaction){
		await interaction.deferReply();
		const text = 'Cock and ball torture (CBT) is a sexual activity involving application of ' +
			'pain or constriction to the male genitals. This may involve directly painful activities, ' +
			'such as wax play, genital spanking, squeezing, ball-busting, genital flogging, urethral play, ' +
			'tickle torture, erotic electrostimulation or even kicking.';
		const picAttachment = (new AttachmentBuilder(pics[Math.floor(Math.random() * pics.length)])).attachment;
		const audioAttachment = (new AttachmentBuilder(audio)).attachment;

		await interaction.editReply(picAttachment);
		await interaction.followUp({
			content: text,
			files: [audioAttachment]
		});
    }
};
