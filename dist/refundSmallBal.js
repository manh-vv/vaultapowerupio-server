"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eosio_1 = require("./lib/eosio");
const ms_1 = __importDefault(require("ms"));
const env_1 = __importDefault(require("./lib/env"));
const eosio_2 = require("@greymass/eosio");
const eospowerupio_types_1 = require("./lib/types/eospowerupio.types");
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
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
        const result = await eosio_1.getAllScopes({ code: env_1.default.contractAccount.toString(), table: eosio_2.Name.from('account') });
        console.log('accounts:', result.length);
        console.log('Checking for small balances...');
        for (const account of shuffle(result)) {
            const balance = (await eosio_1.getFullTable({ contract: env_1.default.contractAccount, tableName: eosio_2.Name.from('account'), scope: account }))[0].balance;
            console.log(balance);
            if (parseFloat(balance) < 0.003) {
                console.log(account, balance);
                const result = await eosio_1.doAction(eosio_2.Name.from('withdraw'), eospowerupio_types_1.Withdraw.from({ owner: account, quantity: balance, receiver: account }), null, [eosio_2.PermissionLevel.from("eospowerupio@powerup")], [env_1.default.keys[1]]);
                console.log(result);
            }
        }
    }
    catch (error) {
        console.error(error);
    }
}
init().catch(err => console.log(err.toString()));
setInterval(init, ms_1.default('1h'));
//# sourceMappingURL=refundSmallBal.js.map