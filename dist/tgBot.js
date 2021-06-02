"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./lib/utils");
const telegraf_1 = require("telegraf");
const fs_extra_1 = require("fs-extra");
const db_1 = __importDefault(require("./lib/db"));
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
const serverActions_1 = require("./lib/serverActions");
const ms_1 = __importDefault(require("ms"));
const bot = new telegraf_1.Telegraf(token);
async function init(...inputs) {
    try {
        bot.use(telegraf_1.Telegraf.log());
        bot.command('start', async (ctx) => {
            registerUser(ctx);
            await ctx.replyWithPhoto({ source: fs_extra_1.readFileSync('../images/powerupBanner.jpg') }, { caption: "Welcome to eospowerup.io Bot, powered by Boid and Eden on EOS." });
            await showMainMenu(ctx);
        }).catch(err => console.error(err.toString()));
        bot.command('test', async (ctx) => {
            registerUser(ctx);
        }).catch(err => console.error(err.toString()));
        bot.hears('Free PowerUp', async (ctx) => {
            await registerUser(ctx);
            const tgQuota = await checktgQuota(ctx.message.from.id);
            if (tgQuota.error) {
                await ctx.reply(tgQuota.error);
                await showMainMenu(ctx);
            }
            else if (tgQuota.nextPowerup) {
                await ctx.replyWithHTML(`
        <strong>Free PowerUp Error:</strong>
        ❌ Free PowerUp Quota reached for this account.
        ⏲️ Next free PowerUp available:
        ${timeAgo.format(new Date(tgQuota.nextPowerup))}
        `);
                return showMainMenu(ctx);
            }
            else {
                await ctx.reply(`You have ${tgQuota.quotaAvailable} of ${freeDailyQuota} free PowerUps available today.`);
            }
            await ctx.reply('Enter the name of the EOS account to PowerUp');
            bot.hears(RegExp('[\s\S]*'), async (ctx) => {
                await triggerPowerUp(ctx, env_1.default.contractAccount.toString(), ctx.message.text);
                await showMainMenu(ctx);
            });
        }).catch(err => console.error(err.toString()));
        bot.launch();
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    }
    catch (error) {
        console.error(error.toString());
    }
}
exports.default = init;
async function checktgQuota(tgid) {
    try {
        const recentPowerups = await db_1.default.dopowerup.findMany({
            where: { User: { telegramId: tgid }, payer: env_1.default.contractAccount.toString(), time: { gte: Date.now() - ms_1.default('24hr') }, failed: { not: true } },
            orderBy: { time: 'desc' },
        });
        if (recentPowerups.length >= freeDailyQuota) {
            console.log('found recent tg User powerups');
            const oldest = recentPowerups[recentPowerups.length - 1];
            console.log(oldest);
            const elapsed = Date.now() - oldest.time;
            console.log('elapsed', elapsed);
            const timeLeft = ms_1.default('24h') - elapsed;
            const nextPowerup = Date.now() + timeLeft;
            console.log('msleft:', timeLeft);
            return { nextPowerup, quotaAvailable: 0 };
        }
        else
            return { quotaAvailable: freeDailyQuota - recentPowerups.length };
    }
    catch (error) {
        console.error('checkQuota Error:', error.toString());
        return { error: "account error", quotaAvailable: 0 };
    }
}
async function registerUser(ctx) {
    try {
        'Checking User Registration...';
        console.log(ctx.message.from.id);
        const from = ctx.message.from;
        const result = await db_1.default.user.upsert({
            where: { telegramId: from.id },
            create: { telegramHandle: from.username, telegramId: from.id },
            update: {}
        });
        console.log('User Registered', result);
    }
    catch (error) {
        console.log(error.toString());
        ctx.reply('Error: ' + error.toString());
    }
}
async function showMainMenu(ctx) {
    await ctx.reply('Choose an action below...', telegraf_1.Markup.keyboard(['Free PowerUp']).resize().oneTime());
}
async function triggerPowerUp(ctx, payer, name) {
    const statusMsg = await ctx.reply('Validating Account...');
    name = name.trim().toLowerCase();
    const valid = await utils_1.accountExists(name);
    if (!valid)
        return bot.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, name + ' is not a valid EOS Account');
    console.log(valid);
    let dots = [];
    let powerupResult;
    if (payer == env_1.default.contractAccount.toString()) {
        serverActions_1.freePowerup(name).then(el => {
            powerupResult = el;
        }).catch(error => {
            powerupResult = error;
        });
    }
    while (!powerupResult) {
        await utils_1.sleep(500);
        dots.push('⚡');
        await bot.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, 'Powering Up' + dots.join(''));
        if (dots.length == 5)
            dots = [];
    }
    await bot.telegram.deleteMessage(ctx.chat.id, statusMsg.message_id).catch(err => console.error(err.toString()));
    if (!powerupResult.status || powerupResult.status == 'error') {
        ctx.replyWithHTML(`
    <strong>${name} Free PowerUp Error:</strong>
    ❌ ${JSON.stringify(powerupResult.errors)}
  `);
    }
    else if (powerupResult.status == 'success') {
        await db_1.default.dopowerup.update({ where: { txid: powerupResult.txid }, data: { User: { connect: { telegramId: ctx.message.from.id } } } });
        await ctx.replyWithHTML(`
    <strong>${name} received</strong>
    ⚡ CPU ${powerupResult.powerupLog.received_cpu_ms.value.toFixed(0)} ms
    ⛓️ NET ${powerupResult.powerupLog.received_net_kb.value.toFixed(0)} kb
    🔗 <a href="https://bloks.io/transaction/${powerupResult.txid}">txid</a>
  `);
    }
    else if (powerupResult.status == 'reachedFreeQuota') {
        bot.telegram.deleteMessage(ctx.chat.id, statusMsg.message_id).catch(err => console.error(err.toString()));
        await ctx.replyWithHTML(`
    <strong>${name} Free Quota Reached</strong>
    ⏲️ Next free PowerUp available:
    ${new Date(powerupResult.nextPowerup).toUTCString()}
  `);
    }
    else {
        await ctx.reply(JSON.stringify(powerupResult));
    }
}
if (require.main === module) {
    console.log('Starting Telegram Bot');
    init(...process.argv).catch(console.error)
        .then((result) => console.log('Finished'));
}
//# sourceMappingURL=tgBot.js.map