"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.freePowerup = exports.doAutoPowerup = exports.doPowerup = exports.resourcesCosts = void 0;
const eosio_1 = require("@greymass/eosio");
const eosio_2 = require("./eosio");
const eospowerupio_types_1 = require("./types/eospowerupio.types");
const db_1 = __importDefault(require("./db"));
const env_1 = __importDefault(require("./env"));
const ms_1 = __importDefault(require("ms"));
const freeDailyQuota = 2;
setInterval(updateResourceCosts, ms_1.default('5 minutes'));
updateResourceCosts();
async function updateResourceCosts() {
    exports.resourcesCosts = await eosio_2.getResouceCosts();
}
async function doPowerup(payer, receiver, cpuQuantityMs, netQuantityMs) {
    const { cpuMsCost, netKbCost, kbToFrac, msToFrac } = exports.resourcesCosts || await eosio_2.getResouceCosts();
    const max_payment = eosio_1.Asset.from((((cpuMsCost * cpuQuantityMs) + (netKbCost * netQuantityMs)) * 1.05), eosio_1.Asset.Symbol.from("4,EOS"));
    const cpu_frac = msToFrac * cpuQuantityMs;
    const net_frac = kbToFrac * netQuantityMs;
    console.log('Max Payment:', max_payment.toString());
    const params = eospowerupio_types_1.Dopowerup.from({ cpu_frac, max_payment, payer, net_frac, receiver });
    const results = await eosio_2.doAction('dopowerup', params);
    return results;
}
exports.doPowerup = doPowerup;
async function doAutoPowerup(payer, watch_account, cpuQuantityMs, netQuantityMs) {
    const { cpuMsCost, netKbCost, kbToFrac, msToFrac } = exports.resourcesCosts || await eosio_2.getResouceCosts();
    const max_payment = eosio_1.Asset.from((((cpuMsCost * cpuQuantityMs) + (netKbCost * netQuantityMs)) * 1.05), eosio_1.Asset.Symbol.from("4,EOS"));
    const cpu_frac = msToFrac * cpuQuantityMs;
    const net_frac = kbToFrac * netQuantityMs;
    console.log('Max Payment:', max_payment.toString());
    const params = eospowerupio_types_1.Autopowerup.from({ cpu_frac, max_payment, payer, net_frac, watch_account });
    const results = await eosio_2.doAction('autopowerup', params, null, [eosio_1.PermissionLevel.from({ actor: env_1.default.workerAccount, permission: env_1.default.workerPermission }), eosio_1.PermissionLevel.from({ actor: env_1.default.contractAccount, permission: "workers" })]);
    return results;
}
exports.doAutoPowerup = doAutoPowerup;
async function checkBlacklist(account) {
    const result = await db_1.default.blacklist.findUnique({ where: { account: account.toString() } });
    return result;
}
async function freePowerup(accountName, params) {
    if (typeof accountName == 'string')
        accountName = eosio_1.Name.from(accountName);
    const blacklisted = await checkBlacklist(accountName);
    if (blacklisted)
        return { status: 'blacklisted', errors: [{ blacklisted: blacklisted.reason }] };
    const recentPowerups = await db_1.default.dopowerup.findMany({
        where: { receiver: accountName.toString(), payer: env_1.default.contractAccount.toString(), time: { gte: Date.now() - ms_1.default('24hr') }, failed: { not: true } },
        orderBy: { time: 'desc' },
    });
    console.log('recent Powerups', recentPowerups.length);
    if (recentPowerups.length < freeDailyQuota) {
        const result = await doPowerup(env_1.default.contractAccount, accountName, 3, 20);
        if (result?.receipts.length > 0) {
            const powerupData = eospowerupio_types_1.Dopowerup.from(result.receipts[0].receipt.action_traces[0].act.data);
            const logPowerUpData = eospowerupio_types_1.Logpowerup.from(result.receipts[0].receipt.action_traces[0].inline_traces[1].inline_traces[0].act.data);
            await db_1.default.dopowerup.create({
                data: {
                    cpu_frac: powerupData.cpu_frac.toNumber(),
                    net_frac: powerupData.net_frac.toNumber(),
                    payer: powerupData.payer.toString(),
                    receiver: powerupData.receiver.toString(),
                    time: Date.parse(result.receipts[0].receipt.block_time.toString() + 'z'),
                    txid: result.receipts[0].receipt.id.toString(),
                    failed: false,
                    reversible: true,
                }
            });
            return { status: 'success', powerupLog: logPowerUpData, txid: result.receipts[0].receipt.id, recentPowerups };
        }
        return { status: 'error', errors: result.errors };
    }
    else {
        const oldest = recentPowerups[recentPowerups.length - 1];
        const elapsed = Date.now() - oldest.time;
        const timeLeft = ms_1.default('24h') - elapsed;
        const nextPowerup = Date.now() + timeLeft;
        return { status: 'reachedFreeQuota', nextPowerup, recentPowerups };
    }
}
exports.freePowerup = freePowerup;
async function getStats() {
    const stats = await db_1.default.stats.findFirst({
        take: 1, orderBy: { createdAt: 'desc' }
    });
    return stats;
}
exports.getStats = getStats;
//# sourceMappingURL=serverActions.js.map