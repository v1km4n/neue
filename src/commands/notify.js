const { SlashCommandBuilder } = require("discord.js");
const discordIDs = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notify')
        .setDescription('Turning notifications on v1km4n\'s server on and off'),
    async execute(interaction){
        if (interaction.guildId === discordIDs.guilds.vikmanPublic) {
            if (!interaction.member.roles.cache.some(role => role.id === discordIDs.roles.notificationRole)) {
                await interaction.member.roles.add(discordIDs.roles.notificationRole);
                interaction.reply('Теперь ты занесён в список поддерживаемых в курсе');
            } else {
                await interaction.member.roles.remove(discordIDs.roles.notificationRole);
                interaction.reply('Ты удалён из списка поддерживаемых в курсе');
            }
        } else {
            interaction.reply('Эта команда работает только на https://discord.gg/7xptNH4');
        }
    }
};
