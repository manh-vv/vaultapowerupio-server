"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const env_1 = __importDefault(require("./lib/env"));
const eosio_1 = require("./lib/eosio");
const ms_1 = __importDefault(require("ms"));
const utils_1 = require("./lib/utils");
const serverActions_1 = require("./lib/serverActions");
const eosio_2 = require("@greymass/eosio");
const eospowerupio_types_1 = require("./lib/types/eospowerupio.types");
async function autoBuyRam(payer, watch) {
    eosio_1.doAction('autobuyram', eospowerupio_types_1.Autobuyram.from({ payer, watch_account: watch.account }), null, [eosio_2.PermissionLevel.from({ actor: env_1.default.workerAccount, permission: env_1.default.workerPermission }), eosio_2.PermissionLevel.from({ actor: env_1.default.contractAccount, permission: "workers" })]);
}
async function getAccountBw(account) {
    const resources = await eosio_1.getAccount(account);
    const msAvailable = resources.cpu_limit.available.toNumber() / 1000;
    const netAvailable = resources.net_limit.available.toNumber() / 1000;
    const quota = resources.ram_quota;
    const usage = resources.ram_usage;
    const available = quota.toNumber() - usage.toNumber();
    const remainingKb = available / 1000;
    return { msAvailable, netAvailable, resources, remainingKb };
}
async function autoPowerup(owner, watch, doNet = false) {
    console.log(' ');
    console.log('AutoPowerUp Triggered for:', watch.account.toString());
    console.log(' ');
    let cpu = Math.max(watch.powerup_quantity_ms.toNumber(), 5);
    let net = Math.max(watch.powerup_quantity_ms.toNumber() * 3, 150);
    serverActions_1.doAutoPowerup(owner, watch.account, cpu, net).then(el => {
        const receipt = el.receipts[0];
        if (receipt) {
            console.log(' ');
            console.log('PowerUp Issued:', owner.toString(), watch.account.toString());
            console.log('CPU:', cpu);
            console.log('NET:', net);
            console.log(receipt.url + ": " + receipt.receipt.id);
            console.log(' ');
        }
        else {
            console.log(' ');
            console.error('PowerUp Error:', owner.toString(), watch.account.toString());
            console.error('CPU:', cpu);
            console.error('NET:', net);
            console.error(el.errors);
            console.log(' ');
        }
    });
}
async function checkWatchAccount(owner, watch) {
    const { msAvailable, netAvailable, remainingKb } = await getAccountBw(watch.account);
    console.log('Available:', watch.account.toString(), "CPU:", msAvailable, "NET:", netAvailable, "RAM:", remainingKb);
    if (watch.min_cpu_ms.toNumber() > 0) {
        if (msAvailable <= watch.min_cpu_ms.toNumber())
            autoPowerup(owner, watch);
        if (netAvailable <= watch.min_cpu_ms.toNumber() / 4)
            autoPowerup(owner, watch, true);
    }
    if (watch.min_kb_ram.toNumber() > 0 && watch.buy_ram_quantity_kb.toNumber() > 0) {
        if (remainingKb <= watch.min_kb_ram.toNumber())
            autoBuyRam(owner, watch);
    }
}
async function init(owner) {
    try {
        if (owner)
            owner = eosio_2.Name.from(owner);
        console.time('totalRun');
        let owners;
        if (!owner)
            owners = await eosio_1.getAllScopes({ code: env_1.default.contractAccount, table: "account" });
        else
            owners = [owner];
        for (const owner of utils_1.shuffle(owners)) {
            let watchAccounts = [];
            watchAccounts = (await eosio_1.getFullTable({ tableName: "watchlist", scope: owner, type: eospowerupio_types_1.WatchlistRow }));
            for (const watch of utils_1.shuffle(watchAccounts)) {
                await Promise.race([
                    checkWatchAccount(owner, watch),
                    new Promise((res, reject) => setTimeout(() => reject(new Error("checkWatchAccount Timeout!")), ms_1.default('8s')))
                ]).catch(err => console.error(err.toString(), owner, watch));
            }
        }
    }
    catch (error) {
        console.error('pwrBot error:', error);
    }
    console.timeEnd('totalRun');
}
async function loop() {
    await init(process.argv[2]);
    return loop();
}
loop();
//# sourceMappingURL=pwrBot.js.map