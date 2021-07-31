module.exports = {
    name: 'channel',
    description: '',
    execute(message, args) {
        creationDate = message.channel.createdAt;
        let date = creationDate.getDate();
        let month = creationDate.getMonth()+1;
        let year = creationDate.getYear()+1900;
        let hours = creationDate.getHours();
        let minutes = creationDate.getMinutes();
        message.channel.send(`This channel was created on ${date}/${month}/${year} at ${hours}:${minutes}`).then(
            message.channel.send(`Its ID is \`\`\`${message.channel.id}\`\`\``)
        );
    },
};