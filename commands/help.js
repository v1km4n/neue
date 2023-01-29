module.exports = {
	name: 'help',
	description: 'Main Bot Commands',
	execute(message, args) {
		message.author.send(`\`\`\`
!etf2l [ ссылка на Steam ] - ETF2L профиль, привязанный к этому Steam аккаунту
!leagues [ ссылка на Steam ] - ссылки на ETF2L, UGC, RGL для данного Steam аккаунта
!notifications - включить/выключить уведомления на сервере\`\`\`
		`);
	},
};