"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickEndpoint = exports.pickRpc = exports.doAction = exports.getAccount = exports.getInfo = exports.getFullTable = exports.getAllScopes = exports.safeDo = exports.getResouceCosts = exports.rpcs = void 0;
const antelope_1 = require("@wharfkit/antelope");
const node_fetch_1 = __importDefault(require("node-fetch"));
const ms_1 = __importDefault(require("ms"));
const utils_1 = require("./utils.js");
const env_1 = __importDefault(require("./env.js"));
const db_1 = __importDefault(require("./db.js"));
const resources_1 = require("@wharfkit/resources");
let client;
let provider;
const sleep = async (ms) => await new Promise((resolve) => setTimeout(resolve, ms));
function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function errorCounter(endpoint, error) {
    console.log("writing error:", endpoint, error);
    db_1.default.rpcErrors.create({ data: { endpoint, error, time: Date.now() } }).catch(console.error);
}
async function getResouceCosts(retry) {
    if (!retry)
        retry = 0;
    try {
        const doit = async () => {
            const url = pickRpc().endpoint.toString();
            try {
                const resources = new resources_1.Resources({ fetch: node_fetch_1.default, url });
                const powerup = await resources.v1.powerup.get_state();
                const sample = await resources.getSampledUsage();
                const cpuMsCost = powerup.cpu.price_per_ms(sample, 1);
                const netKbCost = powerup.net.price_per_kb(sample, 1);
                const msToFrac = powerup.cpu.frac_by_ms(sample, 1);
                const kbToFrac = powerup.net.frac_by_kb(sample, 1);
                console.log("Resource Costs:", url, { cpuMsCost, netKbCost, msToFrac, kbToFrac });
                return { cpuMsCost, netKbCost, msToFrac, kbToFrac };
            }
            catch (error) {
                console.error("Resource Costs Error:", url, error);
                errorCounter(url, error.toString());
                await sleep((0, ms_1.default)("8s"));
                throw (error);
            }
        };
        const result = await Promise.race([
            doit(),
            new Promise((res, reject) => setTimeout(() => reject(new Error("getResouceData Timeout!!!!")), (0, ms_1.default)("3s")))
        ]);
        if (result)
            return result;
        else
            return null;
    }
    catch (error) {
        console.error("DoRequest Error:", error.toString());
        console.error("RETRY", retry);
        retry++;
        if (retry < 5)
            return await getResouceCosts(retry);
    }
}
exports.getResouceCosts = getResouceCosts;
async function safeDo(cb, params, retry) {
    if (!retry)
        retry = 0;
    const rpc = pickRpc();
    const url = rpc.endpoint.toString();
    console.log("safeDo:: Try rpc:", url, cb, params && JSON.stringify(params), retry);
    try {
        const doit = async () => {
            try {
                const result = (await rpc.rpc[cb](params));
                return result;
            }
            catch (error) {
                const errorMsg = error.toString();
                console.error("safeDo Error:", rpc.endpoint.toString(), errorMsg, error);
                if (cb == "get_account" && (errorMsg.search("unknown key") > -1)) {
                    retry = 5;
                    throw (error);
                }
                else {
                    errorCounter(url, errorMsg);
                    await sleep((0, ms_1.default)("8s"));
                    throw (error);
                }
            }
        };
        const result = await Promise.race([
            doit(),
            new Promise((res, reject) => setTimeout(() => reject(new Error("SafeDo Timeout:")), (0, ms_1.default)("3s")))
        ]);
        return result;
    }
    catch (error) {
        console.error("DoRequest Error:", url);
        retry++;
        console.error("RETRY", retry);
        if (retry < 5)
            return await safeDo(cb, params, retry);
    }
}
exports.safeDo = safeDo;
async function getAllScopes(params) {
    let code = params.code;
    if (!code)
        code = env_1.default.contractAccount;
    const table = params.table;
    let lower_bound = null;
    const rows = [];
    async function loop() {
        const result = await safeDo("get_table_by_scope", { code, table, limit: -1, lower_bound });
        result.rows.forEach((el) => rows.push(el));
        console.log("scopes:", rows.length);
        if (result.more)
            lower_bound = result.more;
        else
            return;
        return await loop();
    }
    await loop();
    return rows.map(el => el.scope);
}
exports.getAllScopes = getAllScopes;
async function getFullTable(params) {
    let code = params.contract;
    if (!code)
        code = env_1.default.contractAccount;
    const table = params.tableName;
    let scope = params.scope;
    if (!scope)
        scope = code;
    const type = params.type;
    let lower_bound = null;
    const rows = [];
    async function loop() {
        const result = await safeDo("get_table_rows", { code, table, scope, limit: 10, lower_bound, type });
        result.rows.forEach(el => rows.push(el));
        if (result.more)
            lower_bound = result.next_key;
        else
            return;
        return loop();
    }
    await loop();
    if (type)
        return rows;
    else
        return rows;
}
exports.getFullTable = getFullTable;
async function getInfo() {
    return await safeDo("get_info");
}
exports.getInfo = getInfo;
async function getAccount(name) {
    const result = (await safeDo("get_account", name));
    return result;
}
exports.getAccount = getAccount;
async function doAction(name, data, contract, authorization, keys, retry, max_cpu_usage_ms = 8) {
    if (!data)
        data = {};
    if (!contract)
        contract = antelope_1.Name.from(env_1.default.contractAccount);
    if (!authorization)
        authorization = [antelope_1.PermissionLevel.from({ actor: env_1.default.workerAccount, permission: env_1.default.workerPermission })];
    const info = await getInfo();
    const header = info.getTransactionHeader();
    const action = antelope_1.Action.from({
        authorization,
        account: contract,
        name,
        data
    });
    console.log("doAction::", {
        authorization,
        account: contract,
        name,
        data
    });
    const transaction = antelope_1.Transaction.from(Object.assign(Object.assign({}, header), { actions: [action], max_cpu_usage_ms }));
    if (!keys)
        keys = [env_1.default.keys[0]];
    const signatures = keys.map(key => key.signDigest(transaction.signingDigest(info.chain_id)));
    const signedTransaction = antelope_1.SignedTransaction.from(Object.assign(Object.assign({}, transaction), { signatures }));
    const receipts = [];
    const errors = [];
    let apis = (0, utils_1.shuffle)([...new Set(exports.rpcs)]);
    if (apis.length > 2) {
        apis = apis.splice(0, 4);
    }
    const timeoutTimer = (0, ms_1.default)("20s");
    await Promise.all(apis.map(async ({ endpoint, rpc }) => {
        return await Promise.race([
            new Promise((res) => {
                rpc.push_transaction(signedTransaction).then(result => {
                    receipts.push({ url: endpoint.origin, receipt: result.processed });
                }).catch((error) => {
                    var _a, _b;
                    errors.push({ url: endpoint.origin, error: ((_b = (_a = error === null || error === void 0 ? void 0 : error.error) === null || _a === void 0 ? void 0 : _a.details[0]) === null || _b === void 0 ? void 0 : _b.message) || JSON.stringify(error === null || error === void 0 ? void 0 : error.error, null, 2) });
                }).finally(() => res(null));
            }),
            new Promise((res) => setTimeout(() => {
                errors.push({ url: endpoint.origin, error: "Timeout Error after " + timeoutTimer / 1000 + " seconds" });
                res(null);
            }, timeoutTimer))
        ]);
    }));
    const uniqueErrors = [];
    errors.forEach(el => {
        const exists = uniqueErrors.findIndex(el2 => el2.error = el.error);
        if (exists == -1) {
            el.endpoints = [el.url];
            delete el.url;
            uniqueErrors.push(el);
        }
        else {
            uniqueErrors[exists].endpoints.push(el.url);
        }
    });
    return { receipts, errors: uniqueErrors };
}
exports.doAction = doAction;
function pickRpc() {
    const pick = exports.rpcs[rand(0, exports.rpcs.length - 1)];
    return pick;
}
exports.pickRpc = pickRpc;
function pickEndpoint() {
    const pick = exports.rpcs[rand(0, exports.rpcs.length - 1)];
    return pick.endpoint.toString();
}
exports.pickEndpoint = pickEndpoint;
exports.rpcs = env_1.default.endpoints.map(el => {
    provider = new antelope_1.FetchProvider(el.toString(), { fetch: node_fetch_1.default });
    client = new antelope_1.APIClient({ provider });
    return { endpoint: el, rpc: client.v1.chain };
});
//# sourceMappingURL=eosio.js.map