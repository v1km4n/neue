const Discord = require("discord.js");
const client = new Discord.Client();
client.login(process.env.BOT_TOKEN);
client.on("message", (message) => { 
	if(message.content == "!citata"){
	answer = ["витя красавчик: превед англечане",
		"sobaque: ЗАТЫКАЛ - kill В КОНСОЛЬ", 
		"Zush: Обожаю сидеть и пердеть",
		"Kworker: ну это палка на двух концах",
		"summer: йообаный чернослив, пацаны",
		"Ritz: А мы тут дегротом балуемся :smirk:",
		"vika: хотел как анимешная девочка чихнуть, а получилась какая-то хуйня",
		"WiseGenie: Здарова, мужики", 
		"magistr: бля, я компот пролил, дайте паузу",
		"*DEAD* Badja : vika i really hope you do breathe'nt tonight",
		"DarkMetall: харе жрать, го мге",
		"MrRicardo: Ребята , давайте ютуберу найдём цитаты",
		];
	message.channel.send(answer[Math.floor(Math.random() * answer.length)]);
	}
	if(message.content == "!wise"){
		const attachment = new Attachment('http://puu.sh/C0KWv/752fdc8f1a.PNG');
       		message.channel.send(attachment);
		
	}
	if(message.content == "!non"){
		message.member.addRole("511657769233809408");
		message.reply("теперь ты занесён в список поддерживаемых в курсе. Чтобы отписаться напиши команду !noff");
	}
	if(message.content == "!noff"){
		message.member.removeRole("511657769233809408");
		message.reply("ты удалён из списка поддерживаемых в курсе. Чтобы подписаться обратно напиши команду !non");
	}
	if(message.content == "!catgirl"){
		message.reply("Кошко-девочек ещё не изобрели ;_;");
	}
	if(message.content == "!stream"){
		const embed = new Discord.RichEmbed()
		.setAuthor("Векмон подрубил стрим :thinking:", "http://puu.sh/C1FAH/bd1d3574c5.png")
		.setColor(0x00AE86)
		.setThumbnail("http://puu.sh/C1G6R/ea227f5f40.png")
		.setTimestamp()
		.addField("YouTube", "http://youtube.com/c/V1KM4N/live", true)
		.addBlankField(true)
		.addField("Twitch", "https://www.twitch.tv/v1km4n", true)
		.addBlankField(true)
		 message.channel.send({embed});
	}
});

client.on("ready", ()=>{
	client.channels.get("511298295985864714").send("I'm online!");
});
