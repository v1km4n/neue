const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const pic = 'https://i.imgur.com/pLRMvCr.jpg';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wise')
        .setDescription('MyDpblu` reHuu`'),
    async execute(interaction) {
        const picAttachment = (new AttachmentBuilder(pic)).attachment;
        interaction.reply({files: [picAttachment]});
    }
};
