"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const db_1 = __importDefault(require("./lib/db"));
const { Menu } = require('discord.js-menu');
const env_1 = __importDefault(require("./lib/env"));
const utils_1 = require("./lib/utils");
const javascript_time_ago_1 = __importDefault(require("javascript-time-ago"));
const en_1 = __importDefault(require("javascript-time-ago/locale/en"));
const serverActions_1 = require("./lib/serverActions");
javascript_time_ago_1.default.addDefaultLocale(en_1.default);
const timeAgo = new javascript_time_ago_1.default("en-US");
async function init() {
    try {
        const client = new discord_js_1.default.Client();
        client.on("message", async function (message) {
            var _a, _b, _c;
            let args = message.content.split(' ');
            try {
                if (message.author.bot)
                    return;
                if (message.channel.type == "dm") {
                    if (args[0] == '<@!859243915054678067>')
                        args = args.splice(1, 5);
                }
                else if ((message.channel.type == "text") && ((_b = (_a = message === null || message === void 0 ? void 0 : message.mentions) === null || _a === void 0 ? void 0 : _a.members) === null || _b === void 0 ? void 0 : _b.every(el => el.user.id == client.user.id))) {
                    if (args[0] != '<@!859243915054678067>')
                        return;
                    args = message.content.split(' ').splice(1, 5);
                }
                else
                    return;
                const cmd = (_c = args[0]) === null || _c === void 0 ? void 0 : _c.toLowerCase();
                if (cmd == 'help') {
                    await showHelpMsg(message);
                }
                else if (cmd == 'powerup') {
                    const userid = await registerUser(message.author);
                    const quota = await (0, utils_1.checkQuota)(userid);
                    if (quota.error) {
                        await message.channel.send(quota.error);
                    }
                    else if (quota.nextPowerup) {
                        const errorMsg = new discord_js_1.default.MessageEmbed()
                            .addField("Free PowerUp Error:", [
                            `❌ Free PowerUp Quota reached for ${message.author.username.toString()}.`,
                            '⏲️ Next free PowerUp available:',
                            timeAgo.format(new Date(quota.nextPowerup))
                        ]);
                        message.channel.send(errorMsg);
                    }
                    else {
                        await message.reply(`You have ${quota.quotaAvailable} of ${utils_1.freeDailyQuota} free PowerUps available today.`);
                        await triggerPowerUp(message, env_1.default.contractAccount.toString(), args[1]);
                    }
                }
                else if (message.channel.type == "dm")
                    await showHelpMsg(message);
            }
            catch (error) {
                console.error(error);
            }
        });
        await client.login(env_1.default.discordKey);
    }
    catch (error) {
        console.error(error);
    }
}
async function showHelpMsg(message) {
    let helpMsg = new discord_js_1.default.MessageEmbed();
    if (message.channel.type == "dm") {
        helpMsg
            .setImage("https://eospowerup.io/eospowerupio.jpg")
            .setDescription("Welcome to the https://eospowerup.io Bot, powered by Boid and Eden on EOS.")
            .addField('Command Examples:', ['powerup myeosaccount'], false)
            .addField('Also works in public channels', 'To issue commands to me in a server just use @eospowerupio prefix before each command')
            .addField("Add me to your server", "https://discord.com/api/oauth2/authorize?client_id=859243915054678067&permissions=2148006976&scope=bot");
    }
    else if (message.channel.type == "text") {
        helpMsg
            .setImage("https://eospowerup.io/eospowerupio.jpg")
            .setDescription("Welcome to eospowerup.io Bot, powered by Boid and Eden on EOS.")
            .addField('Command Examples:', ['@eospowerupio powerup myeosaccount'], false)
            .addField('Also you can DM me commands', 'When you DM me, you don\'t have to use the @eospowerupio prefix.');
    }
    await message.channel.send(helpMsg);
}
async function registerUser(user) {
    console.log('Ensure User Registered:', user.id);
    console.log(user.discriminator);
    const result = await db_1.default.user.upsert({
        where: { discordId: user.id },
        create: { discordId: user.id, discordHandle: user.username.toString() },
        update: {}
    });
    console.log(result);
    return result.id;
}
async function triggerPowerUp(message, payer, name) {
    const statusMsg = await message.reply('Validating Account...');
    name = name.trim().toLowerCase();
    const valid = await (0, utils_1.accountExists)(name);
    if (!valid)
        return await statusMsg.edit(name + ' is not a valid EOS Account');
    console.log(valid);
    let dots = [];
    let powerupResult;
    if (payer == env_1.default.contractAccount.toString()) {
        (0, serverActions_1.freePowerup)(name).then(el => {
            powerupResult = el;
        }).catch(error => {
            powerupResult = error;
        });
    }
    while (!powerupResult) {
        await (0, utils_1.sleep)(500);
        dots.push('⚡');
        await statusMsg.edit('Powering Up' + dots.join(''));
        if (dots.length == 5)
            dots = [];
    }
    await statusMsg.delete();
    const response = new discord_js_1.default.MessageEmbed();
    if (!powerupResult.status || powerupResult.status == 'error') {
        message.reply(response.addField("Free PowerUp Error:", `❌ ${JSON.stringify(powerupResult.errors, null, 2)}`));
    }
    else if (powerupResult.status == 'success') {
        await db_1.default.dopowerup.update({ where: { txid: powerupResult.txid }, data: { User: { connect: { discordId: message.author.id } } } });
        await message.reply(response.addField(`${name} received PowerUp.`, [
            `⚡ CPU ${powerupResult.powerupLog.received_cpu_ms.value.toFixed(0)} ms`,
            `⛓️ NET ${powerupResult.powerupLog.received_net_kb.value.toFixed(0)} kb`,
            `🔗 [txid](https://bloks.io/transaction/${powerupResult.txid})`
        ]));
    }
    else if (powerupResult.status == 'reachedFreeQuota') {
        await message.reply(response.addField(`${name} Free Quota Reached`, [
            `⏲️ Next free PowerUp available:`,
            `${new Date(powerupResult.nextPowerup).toUTCString()}`
        ]));
    }
    else {
        await message.reply(JSON.stringify(powerupResult, null, 2));
    }
}
init().catch(console.error);
//# sourceMappingURL=discordBot.js.map