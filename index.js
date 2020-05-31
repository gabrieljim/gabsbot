require("dotenv").config();
const fs = require("fs");
const { Telegraf } = require("telegraf");
const fetch = require("node-fetch");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.hears(/^\/help/, ctx => {
	ctx.reply(
		`
help - List commands
movie - Shows the current movie
deadline - Show remaining days
setmovie - Set the current movie
whoisnext - Shows who's next
next - Pass your turn to the next person
order - Lists the current order
		`,
		{ reply_to_message_id: ctx.message.message_id }
	);
});

bot.hears(/^\/order/, ctx => {
	const users = JSON.parse(fs.readFileSync("./users.json", "utf8")).users;
	let list = "";
	users.forEach((user, index) => {
		list += `${index + 1}. ${user.name}\n\n`;
	});
	ctx.reply(list, { reply_to_message_id: ctx.message.message_id });
});

bot.hears(/^\/next/, ctx => {
	const current = JSON.parse(fs.readFileSync("./current.json", "utf8"));
	if (ctx.message.from.id == current.id) {
		const users = JSON.parse(fs.readFileSync("./users.json", "utf8")).users;
		let next = users.findIndex(user => user.id == current.id) + 1;
		if (next === users.length) {
			next = 0;
		}
		ctx.reply(`${users[next].name}'s up`, {
			reply_to_message_id: ctx.message.message_id
		});
		fs.writeFileSync(
			"./current.json",
			`
{
	"name": "${users[next].name}",
	"id": "${users[next].id}"
}
		`
		);
	} else {
		ctx.reply("Only " + current.name + " can pass the turn", {
			reply_to_message_id: ctx.message.message_id
		});
	}
});

bot.hears(/^\/whoisnext/, ctx => {
	const current = JSON.parse(fs.readFileSync("./current.json", "utf8"));
	const users = JSON.parse(fs.readFileSync("./users.json", "utf8")).users;
	let next = users.findIndex(user => user.id == current.id) + 1;
	if (next === users.length) {
		next = 0;
	}
	ctx.reply("Next up is " + users[next].name, {
		reply_to_message_id: ctx.message.message_id
	});
});

bot.hears(/^\/movie/, ctx => {
	const currentMovie = fs.readFileSync("./movie", "utf8");
	const currentUser = JSON.parse(fs.readFileSync("./current.json", "utf8"));
	ctx.reply("Current movie is " + currentMovie + " by " + currentUser.name, {
		reply_to_message_id: ctx.message.message_id
	});
});

bot.hears(/^\/deadline/, ctx => {
	const content = fs.readFileSync("./deadline", "utf8");
	const deadline = new Date(content);
	const timeLeft = deadline - new Date();
	const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
	console.log(timeLeft);
	if (daysLeft > 0) {
		if (daysLeft === 1) {
			ctx.reply(`There is 1 day left`, {
				reply_to_message_id: ctx.message.message_id
			});
		} else {
			ctx.reply(`There are ${daysLeft} days left`, {
				reply_to_message_id: ctx.message.message_id
			});
		}
	} else if (daysLeft === 0) {
		ctx.reply(`Last day to watch it!`, {
			reply_to_message_id: ctx.message.message_id
		});
	} else {
		ctx.reply(`Time's up!`, {
			reply_to_message_id: ctx.message.message_id
		});
	}
});

bot.hears(/^\/setmovie/, ctx => {
	const current = JSON.parse(fs.readFileSync("./current.json", "utf8"));
	if (ctx.message.from.id == current.id) {
		const command = ctx.message.text.split(" ");
		if (command.length === 1) {
			ctx.reply(
				`You messed it up you fucking dipshit seriously how hard is it the command is supposed to go like this:\n\n\`/setMovie YOUR STUPID MOVIE HERE\`\n\nAlso, when you're getting command suggestions, hold \`/setMovie\` instead of tapping it, it'll prompt you for a movie instead of just sending it`,
				{
					reply_to_message_id: ctx.message.message_id,
					parse_mode: "Markdown"
				}
			);
			return;
		} else {
			const newMovie = command.slice(1).join(" ");
			ctx
				.reply("New movie is " + newMovie, {
					reply_to_message_id: ctx.message.message_id
				})
				.then(msg => ctx.pinChatMessage(msg.message_id));
			fs.writeFileSync("./movie", newMovie);
			const deadline = new Date();
			deadline.setDate(deadline.getDate() + 5);
			fs.writeFileSync("./deadline", deadline);
		}
	} else {
		ctx.reply(`It's ${current.name}'s turn`, {
			reply_to_message_id: ctx.message.message_id
		});
	}
});

// bullshit memes

bot.hears(/^\/ahegao/, ctx => {
	fetch("https://assets.ahegao.egecelikci.com/data.json").then(res =>
		res.json().then(ahegaos => {
			const randomAhegao = ahegaos[Math.floor(Math.random() * ahegaos.length)];
			const link = `https://assets.ahegao.egecelikci.com/images/${randomAhegao}`;
			ctx.replyWithPhoto(link);
		})
	);
});

bot.launch();
