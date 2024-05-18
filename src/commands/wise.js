const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const pic = 'https://i.imgur.com/pLRMvCr.jpg';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wise')
        .setDescription('MyDpblu` reHuu`'),
    async execute(interaction) {
        await interaction.deferReply();
        const picAttachment = (new AttachmentBuilder(pic)).attachment;
        interaction.editReply({files: [picAttachment]});
    }
};
