const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => {
	return () => console.log(ctx);
});

bot.on("inline_query", ctx => {
	return () => console.log(ctx);
});

exports.handler = async event => {
	await bot.handleUpdate(JSON.parse(event.body));
	return { statusCode: 200, body: "" };
};
