"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("./lib/env"));
const eosio_1 = require("./lib/eosio");
const nftTypes_1 = require("./lib/types/nftTypes");
let contract = 'pwrupnfts';
if (env_1.default.chain == 'eos')
    contract = 'powerup.nfts';
console.log('using contract:', contract);
async function claimAll() {
    const allClaimed = await eosio_1.getFullTable({ tableName: 'claimed', contract, type: nftTypes_1.Claimed });
    const unclaimed = allClaimed.filter(el => el.bronze_unclaimed.toNumber() > 0);
    console.log('found', unclaimed.length, 'unclaimed');
    for (const row of unclaimed) {
        console.log('claiming for', row.account.toString());
        let data = nftTypes_1.Claim.from({ donator: row.account });
        const result = await eosio_1.doAction('claim', data, contract).catch(console.error);
        if (!result)
            console.error('claim erorr');
        else if (result.receipts.length == 0)
            console.error('claim erorr:', result.errors);
        if (result) {
            console.log(result.receipts[0].url.toString());
            console.log(result.receipts[0].receipt.id);
        }
    }
}
async function init() {
    try {
        const rounds = await eosio_1.getFullTable({ tableName: 'rounds', contract: 'powerup.nfts', type: nftTypes_1.Rounds });
        const unrewarded = rounds.filter(el => el.rewarded == false);
        for (const round of unrewarded) {
            const data = nftTypes_1.Rewardround.from({ round_id: round.id });
            const result = await eosio_1.doAction('rewardround', data, contract).catch(console.error);
            if (!result)
                return console.error('rewardround erorr');
            if (result.receipts.length == 0)
                console.error('rewardround erorr:', result.errors);
            console.log(result.receipts[0].url.toString());
            console.log(result.receipts[0].receipt.id);
        }
        await claimAll();
    }
    catch (error) {
        console.error('top level error:', error);
    }
}
init();
//# sourceMappingURL=rewardRounds.js.map