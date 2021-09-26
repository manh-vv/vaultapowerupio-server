"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mixpanel_1 = __importDefault(require("mixpanel"));
const eosio_1 = require("./lib/eosio");
const env_1 = __importDefault(require("./lib/env"));
const eosio_2 = require("@greymass/eosio");
const eospowerupio_types_1 = require("./lib/types/eospowerupio.types");
const db_1 = __importDefault(require("./lib/db"));
const ms_1 = __importDefault(require("ms"));
var mixpanel = mixpanel_1.default.init('9ff1909bddc4e74db9192b48f0149941', {
    protocol: 'https'
});
var stats = {
    owners: 0,
    totalWatched: 0
};
async function updateStats(data) {
    try {
        let totalWatched = 0;
        let totalDeposited = 0;
        let i = 0;
        let i2 = 0;
        const owners = await eosio_1.getAllScopes({ code: env_1.default.contractAccount, table: eosio_2.Name.from("account") });
        stats.owners = owners.length;
        console.log('Owners', stats.owners);
        let getResults = [];
        owners.forEach(async (owner) => {
            getResults.push(new Promise(async (res, rej) => {
                setTimeout(async () => {
                    const result = await eosio_1.getFullTable({ tableName: eosio_2.Name.from("watchlist"), contract: env_1.default.contractAccount, scope: owner, type: eospowerupio_types_1.WatchlistRow });
                    totalWatched += result.length;
                    res(null);
                }, 841 * i);
                i++;
            }));
            getResults.push(new Promise(async (res, rej) => {
                setTimeout(async () => {
                    const result = await eosio_1.getFullTable({ tableName: eosio_2.Name.from("account"), contract: env_1.default.contractAccount, scope: owner, type: eospowerupio_types_1.AccountRow });
                    totalDeposited += parseFloat(result[0]?.balance) || 0;
                    res(null);
                }, 500 * i2);
                i2++;
            }));
        });
        await Promise.all(getResults);
        const errors = await db_1.default.rpcErrors.findMany({ where: { time: { gt: Date.now() - ms_1.default('2h') } } });
        const rpcErrorStats = {};
        for (const error of errors) {
            if (rpcErrorStats[error.endpoint])
                rpcErrorStats[error.endpoint]++;
            else
                rpcErrorStats[error.endpoint] = 1;
        }
        const eosBal = parseFloat((await eosio_1.getFullTable({ contract: eosio_2.Name.from('eosio.token'), tableName: eosio_2.Name.from('accounts'), scope: env_1.default.contractAccount }))[0].balance);
        const internalEOSBal = parseFloat((await eosio_1.getFullTable({ contract: env_1.default.contractAccount, tableName: eosio_2.Name.from('account'), scope: env_1.default.contractAccount }))[0].balance);
        const registeredUsers = await db_1.default.user.aggregate({
            _count: { id: true },
        });
        const monthAgo = Date.now() - ms_1.default('4w');
        console.log('monthAgo', monthAgo);
        const activeTgUsers = await db_1.default.user.aggregate({
            where: { freePowerups: { some: { time: { gt: monthAgo } } }, AND: { telegramId: { not: null } } },
            _count: { _all: true }
        });
        const activeDiscordUsers = await db_1.default.user.aggregate({
            where: { freePowerups: { some: { time: { gt: monthAgo } } }, AND: { discordId: { not: null } } },
            _count: { _all: true }
        });
        console.log(activeTgUsers._count._all);
        const allFreePowerups = await db_1.default.logpowerup.aggregate({
            where: { payer: { equals: env_1.default.contractAccount.toString() }, blockTime: { gt: Date.now() - ms_1.default('1d') } },
            _count: { _all: true },
            _sum: { cost: true }
        });
        console.log(allFreePowerups);
        let freePowerups24hr = allFreePowerups._count._all;
        let freePowerupsCost24hr = allFreePowerups._sum.cost || 0;
        const recentPowerups = (await db_1.default.logpowerup.aggregate({
            where: { blockTime: { gt: Date.now() - ms_1.default('1d') }, AND: { payer: { not: env_1.default.contractAccount.toString() } } },
            _count: { _all: true },
            _sum: { fee: true, cost: true },
        }));
        const autopowerups24hr = recentPowerups._count._all || 0;
        const autopowerupfees24hr = recentPowerups._sum.fee || 0;
        const autopowerupCost24hr = recentPowerups._sum.cost || 0;
        const autobuyram = (await db_1.default.logbuyram.aggregate({
            where: { blockTime: { gt: Date.now() - ms_1.default('1d') } },
            _count: { _all: true },
            _sum: { fee: true, cost: true }
        }));
        const autobuyram24hr = autobuyram._count._all || 0;
        const autobuyramfees24hr = autobuyram._sum.fee || 0;
        const autobuyramCost24hr = autobuyram._sum.cost || 0;
        const extraStats = {
            autopowerupCost24hr,
            autobuyramCost24hr,
            autobuyram24hr,
            autobuyramfees24hr,
            autopowerups24hr,
            totalWatched,
            rpcErrorStats,
            registeredUsersTotal: registeredUsers._count.id,
            eosBal,
            internalEOSBal,
            totalDeposited,
            activeTgUsers: activeTgUsers._count._all,
            autopowerupfees24hr,
            freePowerups24hr,
            freePowerupsCost24hr,
            activeDiscordUsers: activeDiscordUsers._count._all
        };
        stats = Object.assign(stats, extraStats);
        console.log(stats);
        console.log('Send Data to mixpanel...');
        mixpanel.track('stats', Object.assign({}, stats));
        await db_1.default.stats.create({
            data: {
                owners: stats.owners,
                totalDeposited: extraStats.totalDeposited,
                totalWatched: extraStats.totalWatched,
                registeredUsersTotal: extraStats.registeredUsersTotal,
                internalEOSBal: extraStats.internalEOSBal,
                activeTgUsers: extraStats.activeTgUsers,
                eosBal: extraStats.eosBal,
                createdAt: Date.now(),
                autopowerups24hr: extraStats.autopowerups24hr,
                autopowerupfees24hr: extraStats.autopowerupfees24hr,
                autobuyram24hr,
                autobuyramfees24hr,
                autopowerupCost24hr,
                autobuyramCost24hr,
                freePowerups24hr,
                freePowerupsCost24hr,
                activeDiscordUsers: extraStats.activeDiscordUsers,
                rpcErrorStats: JSON.stringify(rpcErrorStats)
            }
        });
        return stats;
    }
    catch (error) {
        console.error('Stats Error:', error);
    }
}
if (require.main === module) {
    console.log("Starting: stats");
    updateStats(...process.argv.slice(2)).catch(console.error);
    setInterval(updateStats, ms_1.default('1h'));
}
module.exports = { stats, updateStats };
//# sourceMappingURL=generateStats.js.map