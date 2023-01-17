"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const env_1 = __importDefault(require("./lib/env"));
const db_1 = __importDefault(require("./lib/db"));
const token = env_1.default.telegramKey;
if (token === undefined) {
    throw new Error("telegramKey Missing!");
}
const bot = new telegraf_1.Telegraf(token);
async function init(...inputs) {
    try {
        let message = inputs[2];
        if (!message)
            throw new Error("must specify message");
        console.log("sending message:", message);
        bot.launch();
        const users = await db_1.default.user.findMany({ where: { telegramId: { not: null } } });
        console.log(users.length);
        for (let user of users) {
            console.log("sending:", user.telegramHandle, user.telegramId);
            const result = await bot.telegram.sendMessage(user.telegramId.toString(), message).catch(console.log);
        }
        bot.stop();
        process.once("SIGINT", () => bot.stop("SIGINT"));
        process.once("SIGTERM", () => bot.stop("SIGTERM"));
    }
    catch (error) {
        console.error(error.toString());
    }
}
exports.default = init;
if (require.main === module) {
    console.log("Starting Telegram Bot");
    init(...process.argv).catch(console.error)
        .then((result) => {
        console.log("Finished");
        db_1.default.$disconnect();
    });
}
//# sourceMappingURL=tgBot-announce.js.map