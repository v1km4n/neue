var dmblDates = {
    'Zush': Date.UTC(2021, 5, 5),
    'Fnzkie': Date.UTC(2021, 9, 27),
    'DastRon': Date.UTC(2023, 5, 24),
};
// /\ MONTH - 1 !!!!!!

module.exports = {
    name: 'dmbl',
    description: '',
    execute(message, args) {
        if (args[0] === undefined) {
            let list = `Current list of mujiki:\`\`\`\n`;
            for (mujik in dmblDates) {
                list += `${mujik}\n`;
            }
            list += `\`\`\``;
            message.channel.send(list);
        } else {
            mujikName = args[0][0].toUpperCase() + args[0].slice(1); //sASdfnkSDnk -> sasdfnksdnk -> Sasdfnksdnk
            if (mujikName in dmblDates) {
                if (dmblDates[mujikName] < Date.now()) {
                    message.channel.send(`${mujikName} уже отслужил, мужик`);
                } else {
                    time = dmblDates[mujikName] - Date.now();
                    let milliseconds = time % 1000; //seconds
                    time = (time - milliseconds) / 1000; //milliseconds -> seconds 
                    let seconds = time % 60; //minutes
                    time = (time - seconds) / 60; //seconds -> minutes 
                    let minutes = time % 60; //hours
                    time = (time - minutes) / 60; //minutes -> hours
                    let hours = time % 24; //days
                    time = (time - hours) / 24; //hours -> days
                    let procentage = (100 - ((time / 365) * 100)).toFixed(2);
                    message.channel.send(`${mujikName} вернётся через ${time} дней [${procentage}%]`)
                }
            } else {
                message.channel.send('No such mujik');
            }
        }
        
    },
};