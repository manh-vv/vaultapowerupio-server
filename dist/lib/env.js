"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const fs_extra_1 = require("fs-extra");
const eosio_1 = require("@greymass/eosio");
const readEnv = fs_extra_1.readJSONSync('../.env.json');
let useChain = process.env.CHAIN;
if (useChain)
    useChain = useChain.toLowerCase();
if (!useChain)
    useChain = readEnv.default;
const untyped = readEnv.chain[useChain];
const typed = {
    contractAccount: eosio_1.Name.from(untyped.contractAccount),
    endpoints: untyped.endpoints.map(el => new URL(el)),
    keys: untyped.keys.map(el => eosio_1.PrivateKey.from(el)),
    workerAccount: eosio_1.Name.from(untyped.workerAccount),
    workerPermission: eosio_1.Name.from(untyped.workerPermission),
    telegramKey: untyped?.telegramKey,
    discordKey: untyped?.discordKey,
};
const config = typed;
exports.default = config;
//# sourceMappingURL=env.js.map