require("dotenv").config();
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on("polling_error", err => console.log(err));

bot.on("message", msg => {
	bot.sendMessage(msg.chat.id, "holis");
});
