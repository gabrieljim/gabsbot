const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const start = require("./bot/start");

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
