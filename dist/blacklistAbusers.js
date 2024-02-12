"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const db_1 = __importDefault(require("./lib/db.js"));
async function main() {
    const recentFree = await db_1.default.dopowerup.findMany({ where: { payer: "eospowerupio" } });
    (0, console_1.log)(recentFree.length);
    let acctMap = {};
    for (const pwrUp of recentFree) {
        if (acctMap[pwrUp.receiver])
            acctMap[pwrUp.receiver]++;
        else
            acctMap[pwrUp.receiver] = 1;
    }
    (0, console_1.log)(Object.keys(acctMap).length);
    const abusers = Object.entries(acctMap).filter(([name, num]) => {
        return num > 10;
    });
    (0, console_1.log)(abusers);
    for (const [account, num] of abusers) {
        await db_1.default.blacklist.upsert({
            where: { account },
            create: { account, reason: "Abuse" },
            update: {}
        });
    }
}
main().catch(console.error);
//# sourceMappingURL=blacklistAbusers.js.map