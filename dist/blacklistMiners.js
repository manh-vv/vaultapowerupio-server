"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./lib/db.js"));
const eosio_1 = require("./lib/eosio.js");
async function init() {
    const webXHolders = await (0, eosio_1.getAllScopes)({ code: "webxtokenacc", table: "accounts" });
    console.log(webXHolders.length);
    for (const miner of webXHolders) {
        const result = await db_1.default.blacklist.upsert({
            where: { account: miner.toString() },
            create: { account: miner.toString(), reason: "Mining" },
            update: {}
        });
        console.log(result);
    }
}
init().catch(console.error);
//# sourceMappingURL=blacklistMiners.js.map