"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eosio_1 = require("./lib/eosio.js");
const ms_1 = __importDefault(require("ms"));
const env_1 = __importDefault(require("./lib/env.js"));
const antelope_1 = require("@wharfkit/antelope");
const eospowerupio_types_1 = require("./lib/types/eospowerupio.types.js");
function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
async function init() {
    try {
        const result = await (0, eosio_1.getAllScopes)({ code: env_1.default.contractAccount.toString(), table: antelope_1.Name.from("account") });
        console.log("accounts:", result.length);
        console.log("Checking for small balances...");
        for (const account of shuffle(result)) {
            try {
                const balance = (await (0, eosio_1.getFullTable)({ contract: env_1.default.contractAccount, tableName: antelope_1.Name.from("account"), scope: account }))[0].balance;
                console.log(balance);
                if (parseFloat(balance) < 0.035) {
                    console.log(account, balance);
                    const result = await (0, eosio_1.doAction)(antelope_1.Name.from("withdraw"), eospowerupio_types_1.Withdraw.from({ owner: account, quantity: balance, receiver: account }), null, [antelope_1.PermissionLevel.from("eospowerupio@powerup")], [env_1.default.keys[1]]);
                    console.log(result);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    catch (error) {
        console.error(error);
    }
}
init().catch(err => console.log(err.toString()));
setInterval(init, (0, ms_1.default)("1h"));
//# sourceMappingURL=refundSmallBal.js.map