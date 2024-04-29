const { SlashCommandBuilder } = require("discord.js");
const process = require('process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Bot uptime'),
    async execute(interaction){
        interaction.reply(`I've been running for ${ Math.floor( process.uptime() ) } second(s) on ${ process.platform }`);
    }
};
