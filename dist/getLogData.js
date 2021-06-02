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
const maxQueueLength = 1000;
const writeInterval = 1000;
const queries = {
    logpowerup: { search: `action:logpowerup notif:false receiver:${env_1.default.contractAccount.toString()}`, table: 'logpowerup' }
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
            const data = message.data.searchTransactionsForward;
            const trace = data.trace;
            const actions = trace.matchingActions;
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
            parsedActions.forEach(el => queueSaveAction({ action: el, cursor: data.cursor, table, searchString: query }));
            stream.mark({ cursor: data.cursor });
        }
        if (message.type === "complete") {
            console.log("Stream completed");
            process.exit();
        }
    }, { variables: { cursor, low } }).catch(async (error) => {
        console.error('dfuse gql error:', error);
        await sleep(ms_1.default('30s'));
    });
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
        const streamTransfer = `subscription($cursor: String, $low: Int64) {
      searchTransactionsForward(query:"${query}", cursor: $cursor,irreversibleOnly:true, lowBlockNum: $low) { cursor
        trace { id block{num timestamp} matchingActions{ seq json receiver name }}
      }
    }`;
        startStream(streamTransfer, null, low, queries[name].table, query);
    }
    catch (error) {
        console.error("INIT ERROR:", error);
        process.exit();
    }
}
function queueSaveAction({ action, cursor, table, searchString }) {
    actionQueue.push({ action, cursor, table, searchString });
    if (actionQueue.length > maxQueueLength && currentStream) {
        console.log("closed existing Stream");
        currentStream.close(), currentStream = false;
    }
    console.log("Action Queued:", action.seq);
}
setInterval(() => {
    if (actionQueue[0]) {
        console.log("Queue Size:", actionQueue.length);
        saveAction(actionQueue[0]);
        actionQueue.shift();
    }
    if (actionQueue.length == 0 && currentStream == false)
        init(gName, gFilter, null);
}, writeInterval);
async function saveAction({ action, cursor, table, searchString }) {
    try {
        if (table === 'logpowerup') {
            console.log('Action:', action);
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
        await sleep(ms_1.default('10s'));
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
//# sourceMappingURL=getLogData.js.map