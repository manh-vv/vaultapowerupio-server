"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.freePowerup = exports.hasBronzeStake = exports.loadAccountStakes = exports.loadNftConfig = exports.doAutoPowerup = exports.doPowerup = exports.resourcesCosts = void 0;
const eosio_1 = require("@greymass/eosio");
const eosio_2 = require("./eosio");
const eospowerupio_types_1 = require("./types/eospowerupio.types");
const db_1 = __importDefault(require("./db"));
const env_1 = __importDefault(require("./env"));
const ms_1 = __importDefault(require("ms"));
const nft = __importStar(require("./types/nftTypes"));
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
let nftConfig;
async function loadNftConfig() {
    if (!nftConfig) {
        const config = nft.Config.from((await eosio_2.getFullTable({ tableName: 'config', contract: env_1.default.nftContract, type: nft.Config }))[0]);
        nftConfig = config.nft;
        return nftConfig;
    }
    else
        return nftConfig;
}
exports.loadNftConfig = loadNftConfig;
async function loadAccountStakes(account) {
    try {
        const accountStaked = await eosio_2.getFullTable({ tableName: "staked", contract: env_1.default.nftContract, scope: account, type: nft.Staked });
        return accountStaked;
    }
    catch (error) {
        console.error("loadAccountStakes error:", error);
        return [];
    }
}
exports.loadAccountStakes = loadAccountStakes;
async function hasBronzeStake(account) {
    try {
        const config = await loadNftConfig();
        const accountStaked = await loadAccountStakes(account);
        const exists = accountStaked.find((el) => el.template_id.equals(config.bronze_template_id));
        return exists ? true : false;
    }
    catch (error) {
        return false;
    }
}
exports.hasBronzeStake = hasBronzeStake;
async function freePowerup(accountName, params) {
    if (typeof accountName == 'string')
        accountName = eosio_1.Name.from(accountName);
    const blacklisted = await checkBlacklist(accountName);
    if (blacklisted)
        return { status: 'blacklisted', errors: [{ blacklisted: blacklisted.reason }] };
    const recentPowerups = await db_1.default.dopowerup.findMany({
        where: {
            receiver: accountName.toString(),
            payer: env_1.default.contractAccount.toString(),
            time: { gte: Date.now() - ms_1.default('24hr') },
            failed: { not: true }
        },
        orderBy: { time: 'desc' },
    });
    console.log('recent Powerups', recentPowerups.length);
    if (recentPowerups.length < freeDailyQuota) {
        const bonusSize = await hasBronzeStake(accountName);
        const cpu = bonusSize ? 6 : 3;
        const net = bonusSize ? 40 : 20;
        const result = await doPowerup(env_1.default.contractAccount, accountName, cpu, net);
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
        const elapsed = Date.now() - parseInt(oldest.time.toString());
        const timeLeft = ms_1.default('24h') - elapsed;
        const nextPowerup = Date.now() + timeLeft;
        return { status: 'reachedFreeQuota', nextPowerup, recentPowerups };
    }
}
exports.freePowerup = freePowerup;
async function getStats() {
    let stats = await db_1.default.stats.findFirst({
        take: 1, orderBy: { createdAt: 'desc' }
    });
    console.log(stats);
    stats.createdAt;
    try {
        stats.rpcErrorStats = JSON.parse(stats.rpcErrorStats);
    }
    catch (error) {
        console.error(error);
    }
    return stats;
}
exports.getStats = getStats;
//# sourceMappingURL=serverActions.js.map