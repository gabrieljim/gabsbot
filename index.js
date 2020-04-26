require("dotenv").config();
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

bot.on("polling_error", err => console.log(err));

bot.on("message", msg => {
	bot.sendMessage(msg.chat.id, "hola");
});

/*
const reply = ctx => {
	console.log(ctx);
	ctx.reply("holis");
}

bot.start(ctx => {
	return start(ctx);
});

bot.on("text", ctx => {
	return reply(ctx);
});

bot.on("inline_query", ctx => {
	return console.log(ctx);
});

exports.handler = async event => {
	await bot.handleUpdate(JSON.parse(event.body));
	return { statusCode: 200, body: "" };
};
*/
