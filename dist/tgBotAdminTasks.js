"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const env_1 = __importDefault(require("./lib/env"));
const token = env_1.default.telegramKey;
const javascript_time_ago_1 = __importDefault(require("javascript-time-ago"));
const en_1 = __importDefault(require("javascript-time-ago/locale/en"));
javascript_time_ago_1.default.addDefaultLocale(en_1.default);
const timeAgo = new javascript_time_ago_1.default("en-US");
const freeDailyQuota = 7;
if (token === undefined) {
    throw new Error('telegramKey Missing!');
}
const introImage = '';
const bot = new telegraf_1.Telegraf(token);
//# sourceMappingURL=tgBotAdminTasks.js.map