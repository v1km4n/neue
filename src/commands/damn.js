const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const pic = 'https://i.imgur.com/AXzt5XY.png';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('damn')
        .setDescription('Damn that\'s crazy'),
    async execute(interaction){
        await interaction.deferReply();
        const picAttachment = (new AttachmentBuilder(pic)).attachment;
        await interaction.editReply({files: [picAttachment]});
    }
};
