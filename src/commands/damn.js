const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const pic = 'https://i.imgur.com/AXzt5XY.png';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('damn')
        .setDescription('Damn that\'s crazy'),
    async execute(interaction){
        const picAttachment = (new AttachmentBuilder(pic)).attachment;
        interaction.reply({files: [picAttachment]});
    }
};
