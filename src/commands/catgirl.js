const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('catgirl')
		.setDescription('Harsh trush about catgirls'),
	async execute(interaction) {
		await interaction.deferReply();
        let answer = [
			'Кошкодевочек ещё не изобрели ;_;',
			'В этом мире всё ещё нет смысла жить - кошкодевочек не существует',
			'Кошкодевочек пока нет, придётся перепроходить некопару',
			'Кошкодевочек нет, но вы держитесь',
			'Кошкодевочек ещё не изобрели, но пытаться заставить реальную девушку отыгрывать кошкодевочку незаконно',
			'Не-а, нету кошкодевочек. Да и вообще, как ты себе это представляешь?',
			'У тебя не найдётся сотки на верёвку и мыло? Кошкодевочек ещё не изобрели',
			'Некопара поселила в тебя ложную надежду, которая никогда не оправдается. Живи с этим.',
		];
		await interaction.editReply(answer[Math.floor(Math.random() * answer.length)]);
    }
};
