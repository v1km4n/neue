const discordIDs = require("../discordIDs.json");

module.exports = {
    name: 'notifications',
    description: `Turning notifications on v1km4n's server on and off`,
    execute(message, args) {
        if (message.guild.id == discordIDs.guild.vikmanPublic) {
            if (!message.member.roles.cache.some(role => role.id === discordIDs.role.notificationRole)) {
                message.member.roles.add(discordIDs.role.notificationRole);
                message.reply("теперь ты занесён в список поддерживаемых в курсе");
            } else {
                message.member.roles.remove(discordIDs.role.notificationRole);
                message.reply("ты удалён из списка поддерживаемых в курсе");
            }
        } else {
            message.reply('эта команда работает только на https://discord.gg/7xptNH4');
        }
    },
};