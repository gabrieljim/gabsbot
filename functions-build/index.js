const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const start = require("./bot/start");

bot.start(ctx => {
	return start(ctx);
});

bot.on("text", ctx => {
	return ctx.reply("holis");
});

bot.on("inline_query", ctx => {
	return console.log(ctx);
});

exports.handler = async event => {
	await bot.handleUpdate(JSON.parse(event.body));
	return { statusCode: 200, body: "" };
};
