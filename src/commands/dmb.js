const { SlashCommandBuilder } = require('discord.js');
const dates = {
    'Zush': Date.UTC(2021, 5, 5),
    'fnzkie': Date.UTC(2021, 9, 27),
    'DastRon': Date.UTC(2023, 5, 24)
};
// month-1 (january = 0)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dmb')
        .setDescription('Russian comp players demobilization list')
        .addStringOption(option =>
            option.setName('nickname')
                .setDescription('ETF2L player nickname')),
    async execute(interaction) {
        if (!interaction.options.getString('nickname')) {
            let list = 'Список мужиков:\n';
            for (const date in dates) list += `- ${date}\n`;
            interaction.reply(list);
        } else {
            const player = interaction.options.getString('nickname');
            if (player in dates) {
                if (dates[player] < Date.now()) {
                    interaction.reply(`${player} уже отслужил`);
                } else {
                    let time = dates[player] - Date.now();
                    let milliseconds = time % 1000; //seconds
                    time = (time - milliseconds) / 1000; //milliseconds -> seconds
                    let seconds = time % 60; //minutes
                    time = (time - seconds) / 60; //seconds -> minutes
                    let minutes = time % 60; //hours
                    time = (time - minutes) / 60; //minutes -> hours
                    let hours = time % 24; //days
                    time = (time - hours) / 24; //hours -> days
                    let percentage = (100 - ((time / 365) * 100)).toFixed(2);
                    interaction.reply(`${player} вернётся через ${time} дней [${percentage}%]`);
                }
            } else {
                interaction.reply('Такого мужика нет');
            }
        }
    }
};
