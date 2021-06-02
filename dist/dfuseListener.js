"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dfuse_1 = __importDefault(require("./lib/dfuse"));
const ms_1 = __importDefault(require("ms"));
const db_1 = __importDefault(require("./lib/db"));
const env_1 = __importDefault(require("./lib/env"));
var currentStream;
var gName;
var gFilter;
const sleep = ms => new Promise(res => setTimeout(res, ms));
const maxQueueLength = 100;
const writeInterval = 1000;
const queries = {
    logpowerup: { search: `action:logpowerup notif:false receiver:${env_1.default.contractAccount.toString()}`, table: 'logpowerup' },
    logbuyram: { search: `action:logbuyram notif:false receiver:${env_1.default.contractAccount.toString()}`, table: 'logbuyram' },
    transfer: { search: `account:eosio.token action:transfer receiver:${env_1.default.contractAccount.toString()} -data.to:eosio.rex -data.to:eosio.ram -data.to:eosio.ramfee`, table: 'transfer' }
};
var actionQueue = [];
async function startStream(streamTransfer, cursor, low, table, query) {
    await dfuse_1.default.graphql(streamTransfer, async (message, stream) => {
        currentStream = stream;
        if (message.type === "error") {
            console.error("An error occurred", message.errors, message.terminal);
            stream.close();
            process.exit();
        }
        if (message.type === "data") {
            const results = message.data.searchTransactionsForward.results;
            for (const result of results) {
                const data = result;
                const trace = data.trace;
                const actions = trace.matchingActions;
                console.log('TIMESTAMP:', trace.block.timestamp);
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
                console.log(parsedActions);
                parsedActions.forEach(el => queueSaveAction({ action: el, cursor: data.cursor, table, searchString: query }));
            }
        }
        if (message.type === "complete") {
            console.log("Stream completed");
            if (actionQueue.length == 0)
                safeExit();
        }
    }, { variables: { cursor, low, limit: 10 } }).catch(async (error) => {
        console.error('dfuse gql error:', error);
        if (actionQueue.length == 0)
            safeExit();
    });
}
async function safeExit() {
    await db_1.default.$disconnect();
    if (currentStream)
        await currentStream.close();
    process.exit();
}
async function init(name, filter, replay) {
    gName = name;
    gFilter = filter;
    try {
        var low;
        var lastCursor;
        var query = queries[name].search;
        if (filter)
            query = query + " " + String(filter);
        if (replay) {
            low = Number(replay) || 1;
            console.log("Replaying From Block:", low);
        }
        else {
            let lastCursor = (await db_1.default.cursor.findFirst({
                where: { searchString: { equals: query } }
            }))?.lowBlock;
            if (!lastCursor)
                throw ("query does not have a previous cursor, start with replay first.");
            console.log('lst cursor', lastCursor);
            low = lastCursor + 1;
        }
        console.log("Query:", query);
        const streamTransfer = `query($cursor: String, $low: Int64,$limit:Int64) {
      searchTransactionsForward(query:"${query}", cursor: $cursor, limit:$limit irreversibleOnly:true, lowBlockNum: $low) {
        results{ cursor
        trace { id block{num timestamp} matchingActions{ seq json receiver name }}
        }
      }
    }`;
        startStream(streamTransfer, null, low, queries[name].table, query);
    }
    catch (error) {
        console.error("INIT ERROR:", error);
        safeExit();
    }
}
function queueSaveAction({ action, cursor, table, searchString }) {
    actionQueue.push({ action, cursor, table, searchString });
    console.log("Action Queued:", action.seq);
}
setInterval(() => {
    if (actionQueue[0]) {
        console.log("Queue Size:", actionQueue.length);
        saveAction(actionQueue[0]);
        actionQueue.shift();
    }
}, writeInterval);
async function saveAction({ action, cursor, table, searchString }) {
    try {
        if (table === 'logpowerup') {
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
            console.log('Wrote logpowerup:', result);
        }
        else if (table === 'logbuyram') {
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
            console.log('Wrote logbuyram:', result);
        }
        else if (table == 'transfer') {
            const result = await db_1.default.transfer.upsert({
                where: {
                    seq: action.seq
                },
                create: {
                    from: action.data.from,
                    to: action.data.to,
                    memo: action.data.memo,
                    quantity: parseFloat(action.data.quantity),
                    symbol: action.data.quantity.split(' ')[1],
                    seq: action.seq,
                    txid: action.txid,
                    blockTime: action.block.timestamp
                }, update: {}
            });
            console.log('Wrote Transfer:', result);
        }
        const result = await db_1.default.cursor.upsert({
            where: { searchString },
            create: { searchString, cursor, lowBlock: action.block.num },
            update: { cursor, lowBlock: action.block.num }
        });
        console.log('Wrote Cursor:', result);
    }
    catch (error) {
        console.error('saveAction Error:', error);
        await sleep(ms_1.default('30s'));
        return saveAction({ action, cursor, table, searchString });
    }
}
if (process.argv[2] && require.main === module) {
    if (Object.keys(queries).find(el => el === process.argv[2])) {
        console.log("Starting:", process.argv[2]);
        init(process.argv[2], process.argv[3], process.argv[4]);
    }
    else {
        console.error("Erorr: invalid query");
        process.exit();
    }
}
else
    process.exit();
//# sourceMappingURL=dfuseListener.js.map