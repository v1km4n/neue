const discordIDs = require("../discordIDs.json");

module.exports = {
    name: 'w2g',
    description: '',
    execute(message, args, client) {
        let w2gUserIDs = ["181485162486431745" /* vikman */, "190521582068826113" /* memerica */, "182902167202562048" /* ritz */];
        if (w2gUserIDs.includes(message.author.id)) {
            message.channel.send('https://www.watch2gether.com/rooms/pizzaroom-j1ayx7w6iq1sjgu0');
        } else {
            message.channel.send('You are not allowed to use that command');
            client.channels.cache.get(discordIDs.channel.log).send(`<@${message.author.id}> has tried to run w2g command at ${message.channel.guild.name} -> #${message.channel.name}`);
        }
    },
};