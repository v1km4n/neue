var dmblDates = {
    'Zush': Date.UTC(2021, 5, 5),
    'fnzkie': Date.UTC(2021, 9, 27),
    'DastRon': Date.UTC(2023, 5, 24),
};
// month-1 (january = 0)

module.exports = {
    name: 'dmbl',
    description: '',
    execute(message, args) {
        if (args[0] === undefined) {
            var list = `Список мужиков:\`\n`;
            for (i in dmblDates) {
                list += `${i}\n`;
            }
            list += `\``;
            message.channel.send(list);
        } else {
            if (args[0] in dmblDates) {
                if (dmblDates[args[0]] < Date.now()) {
                    message.channel.send(`${args[0]} уже отслужил`);
                } else {
                    time = dmblDates[args[0]] - Date.now();
                    let milliseconds = time % 1000; //seconds
                    time = (time - milliseconds) / 1000; //milliseconds -> seconds 
                    let seconds = time % 60; //minutes
                    time = (time - seconds) / 60; //seconds -> minutes 
                    let minutes = time % 60; //hours
                    time = (time - minutes) / 60; //minutes -> hours
                    let hours = time % 24; //days
                    time = (time - hours) / 24; //hours -> days
                    let procentage = (100 - ((time / 365) * 100)).toFixed(2);
                    message.channel.send(`${args[0]} вернётся через ${time} дней [${procentage}%]`)
                }
            } else {
                message.channel.send('Такого мужика нет');
            }
        }
        
    },
};