"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const dfuse = __importStar(require("./lib/dfuse"));
const ms_1 = __importDefault(require("ms"));
const db_1 = __importDefault(require("./lib/db"));
const env_1 = __importDefault(require("./lib/env"));
const sleep = ms => new Promise(res => setTimeout(res, ms));
const queries = {
    logpowerup: { search: `action:logpowerup notif:false receiver:${env_1.default.contractAccount.toString()}`, table: "logpowerup" },
    logbuyram: { search: `action:logbuyram notif:false receiver:${env_1.default.contractAccount.toString()}`, table: "logbuyram" },
    transfer: { search: `account:eosio.token action:transfer receiver:${env_1.default.contractAccount.toString()} -data.to:eosio.rex -data.to:eosio.ram -data.to:eosio.ramfee`, table: "transfer" },
    donate: { search: "account:eosio.token action:transfer receiver:powerup.nfts -data.to:eosio.rex -data.to:eosio.ram -data.to:eosio.ramfee", table: "transfer" },
    pomelo: { search: "account:eosio.token action:transfer receiver:app.pomelo data.to:app.pomelo -data.to:eosio.rex -data.to:eosio.ram -data.to:eosio.ramfee", table: "transfer" },
    pomeloClaim: { search: "account:eosio.token action:transfer receiver:claim.pomelo data.to:animus.inc -data.to:eosio.rex -data.to:eosio.ram -data.to:eosio.ramfee", table: "transfer" },
    regminer: { search: "account:gravyhftdefi action:regminer receiver:gravyhftdefi", table: "blacklist" },
    grvmine: { search: "account:gravyhftdefi action:mine", table: "blacklist" }
};
let currentClient = "client1";
function parseActions(action) {
    const data = action;
    const trace = data.trace;
    const actions = trace.matchingActions;
    console.log("TIMESTAMP:", trace.block.timestamp);
    const timems = Date.parse(trace.block.timestamp);
    const parsedActions = actions.map(action => {
        action.block = trace.block;
        action.block.timestamp = timems;
        action.txid = trace.id;
        action.data = action.json;
        action.account = action.receiver;
        action.seq = parseInt(action.seq);
        delete action.json;
        delete action.receiver;
        return action;
    });
    return parsedActions;
}
async function runQuery(dfuseQuery, cursor, low, table, query) {
    return new Promise((res, err) => {
        dfuse[currentClient].graphql(dfuseQuery, async (message, stream) => {
            if (message.type === "error") {
                console.error("An error occurred", message.errors, message.terminal);
                err(new Error(message.errors));
            }
            else if (message.type === "data") {
                const results = message.data.searchTransactionsForward.results;
                for (const result of results) {
                    const parsedActions = parseActions(result);
                    console.log(parsedActions);
                    await writeActions(parsedActions.map(action => { return { action, cursor: result.cursor, table, searchString: query }; }));
                }
            }
            else if (message.type === "complete") {
                console.log("Stream completed");
                stream.close();
                res();
            }
        }, { variables: { cursor, low, limit: 20 } })
            .catch(async (error) => {
            console.error("dfuse gql error:", error);
            if ((error === null || error === void 0 ? void 0 : error.message) == "blocked: document quota exceeded") {
                console.log(currentClient, "changing client");
                if (currentClient == "client1")
                    currentClient = "client2";
                else if (currentClient == "client2")
                    currentClient = "client3";
                else if (currentClient == "client3")
                    currentClient = "client4";
                else
                    currentClient = "client1";
                await sleep((0, ms_1.default)("30s"));
                res();
            }
            else {
                await sleep((0, ms_1.default)("30s"));
                cleanExit();
            }
        });
    });
}
async function saveAction({ action, cursor, table, searchString }) {
    var _a, _b;
    try {
        if (table === "logpowerup") {
            const result = await db_1.default.logpowerup.upsert({
                where: { seq: action.seq },
                create: {
                    action: action.data.action,
                    blockTime: action.block.timestamp,
                    cost: parseFloat(action.data.cost),
                    fee: parseFloat(action.data.fee),
                    payer: action.data.payer,
                    received_cpu_ms: parseFloat(action.data.received_cpu_ms) || 0,
                    received_net_kb: parseFloat(action.data.received_net_kb) || 0,
                    receiver: action.data.receiver,
                    seq: action.seq,
                    total_billed: parseFloat(action.data.total_billed),
                    txid: action.txid
                },
                update: {}
            });
        }
        else if (table === "logbuyram") {
            const result = await db_1.default.logbuyram.upsert({
                where: { seq: action.seq },
                create: {
                    action: action.data.action,
                    blockTime: action.block.timestamp,
                    cost: parseFloat(action.data.cost),
                    fee: parseFloat(action.data.fee),
                    payer: action.data.payer,
                    received_ram_kb: parseFloat(action.data.received_ram_kb),
                    receiver: action.data.receiver,
                    seq: action.seq,
                    total_billed: parseFloat(action.data.total_billed),
                    txid: action.txid
                },
                update: {}
            });
            console.log("Wrote logbuyram:", result);
        }
        else if (table == "transfer") {
            const result = await db_1.default.transfer.upsert({
                where: {
                    seq: action.seq
                },
                create: {
                    from: action.data.from,
                    to: action.data.to,
                    memo: action.data.memo,
                    quantity: parseFloat(action.data.quantity),
                    symbol: action.data.quantity.split(" ")[1],
                    seq: action.seq,
                    txid: action.txid,
                    blockTime: action.block.timestamp
                },
                update: {}
            });
            console.log("Wrote Transfer:", result);
        }
        else if (table == "blacklist") {
            const result = await db_1.default.blacklist.upsert({
                where: { account: (_a = action.data) === null || _a === void 0 ? void 0 : _a.miner },
                create: { account: (_b = action.data) === null || _b === void 0 ? void 0 : _b.miner, reason: "Gravy Mining" },
                update: {}
            });
            console.log(result);
        }
        const result = await db_1.default.cursor.upsert({
            where: { searchString },
            create: { searchString, cursor, lowBlock: action.block.num },
            update: { cursor, lowBlock: action.block.num }
        });
        console.log(currentClient, "Wrote Cursor:", result);
    }
    catch (error) {
        console.error("saveAction Error:", error);
        await sleep((0, ms_1.default)("30s"));
        return saveAction({ action, cursor, table, searchString });
    }
}
async function writeActions(actions) {
    for (const action of actions) {
        try {
            await saveAction(action);
        }
        catch (error) {
            console.error("Write actions error:", error.toString());
            await sleep((0, ms_1.default)("10s"));
            return saveAction(action);
        }
    }
}
async function init(name, filter, replay) {
    var _a;
    try {
        let low;
        let lastCursor;
        let query = queries[name].search;
        if (filter)
            query = query + " " + String(filter);
        if (replay) {
            low = Number(replay) || 1;
            console.log("Replaying From Block:", low);
        }
        else {
            let lastCursor = (_a = (await db_1.default.cursor.findFirst({
                where: { searchString: { equals: query } }
            }))) === null || _a === void 0 ? void 0 : _a.lowBlock;
            if (!lastCursor)
                throw new Error("query does not have a previous cursor, start with replay first.");
            console.log("lst cursor", lastCursor);
            low = parseInt(lastCursor.toString()) + 1;
        }
        console.log("Query:", query);
        const streamTransfer = `query($cursor: String, $low: Int64,$limit:Int64) {
      searchTransactionsForward(query:"${query}", cursor: $cursor, limit:$limit irreversibleOnly:true, lowBlockNum: $low) {
        results{ cursor
        trace { id block{num timestamp} matchingActions{ seq json receiver name }}
        }
      }
    }`;
        await runQuery(streamTransfer, null, low, queries[name].table, query);
    }
    catch (error) {
        console.error("INIT ERROR:", error);
        cleanExit();
    }
}
if (process.argv[2] && require.main === module) {
    start();
}
else
    process.exit();
async function start(params = process.argv) {
    if (Object.keys(queries).find(el => el === params[2])) {
        console.log("Starting:", params[2]);
        let filter = params[3];
        let block = Number(params[4]) || null;
        if (Number(filter)) {
            block = Number(filter);
            filter = "";
        }
        init(params[2], filter, block).finally(async () => {
            await sleep((0, ms_1.default)("5s"));
            start(["", "", process.argv[2], filter]);
        });
    }
    else {
        console.error("Erorr: invalid query");
        cleanExit();
    }
}
async function cleanExit() {
    console.log("Starting clean exit");
    await db_1.default.$disconnect();
    dfuse.client1.release();
    dfuse.client2.release();
    process.kill(process.pid, "SIGTERM");
}
//# sourceMappingURL=dfusePoller.js.map