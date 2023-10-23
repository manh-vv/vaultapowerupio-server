"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("./lib/env.js"));
const eosio_1 = require("./lib/eosio.js");
const ms_1 = __importDefault(require("ms"));
const nftTypes_1 = require("./lib/types/nftTypes.js");
let contract = "pwrupnfts";
if (env_1.default.chain == "eos")
    contract = "powerup.nfts";
console.log("using contract:", contract);
async function getRound() {
    const configTbl = await (0, eosio_1.getFullTable)({ tableName: "config", contract, type: nftTypes_1.Config }).catch(err => console.error(err));
    const conf = configTbl[0];
    const startTime = Date.parse(conf.start_time.toDate().toString()) / 1000;
    const now = (Date.now() / 1000);
    const elapsed = now - startTime;
    const round = Math.floor(elapsed / conf.round_length_sec.toNumber()) + 1;
    console.log("current Round: ", round);
    return round;
}
async function claimAll() {
    const allClaimed = await (0, eosio_1.getFullTable)({ tableName: "claimed", contract, type: nftTypes_1.Claimed });
    const unclaimed = allClaimed.filter(el => el.bronze_unclaimed.toNumber() > 0);
    console.log("found", unclaimed.length, "unclaimed");
    for (const row of unclaimed) {
        console.log("claiming for", row.account.toString());
        let data = nftTypes_1.Claim.from({ donator: row.account });
        const result = await (0, eosio_1.doAction)("claim", data, contract).catch(console.error);
        if (!result)
            console.error("claim erorr", row);
        else {
            if (result.receipts.length == 0)
                console.error("claim erorr:", result.errors);
            else {
                console.log(result.receipts[0].url.toString());
                console.log(result.receipts[0].receipt.id);
            }
        }
    }
}
async function init() {
    try {
        const rounds = await (0, eosio_1.getFullTable)({ tableName: "rounds", contract: "powerup.nfts", type: nftTypes_1.Rounds });
        const currentRound = await getRound();
        const unrewarded = rounds.filter(el => el.rewarded == false && el.id.toNumber() != currentRound);
        console.log("found", unrewarded.length, "unrewarded rounds");
        for (const round of unrewarded) {
            const data = nftTypes_1.Rewardround.from({ round_id: round.id });
            const result = await (0, eosio_1.doAction)("rewardround", data, contract).catch(console.error);
            if (!result)
                console.error("rewardround erorr", round);
            else {
                if (result.receipts.length == 0)
                    console.error("rewardround erorr:", result.errors);
                else {
                    console.log(result.receipts[0].url.toString());
                    console.log(result.receipts[0].receipt.id);
                }
            }
        }
        await claimAll();
    }
    catch (error) {
        console.error("top level error:", error);
        process.exit();
    }
}
init();
setInterval(init, (0, ms_1.default)("1hr"));
//# sourceMappingURL=rewardRounds.js.map