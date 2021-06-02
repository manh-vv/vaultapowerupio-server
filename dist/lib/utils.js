"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountExists = exports.shuffle = exports.cronRunner = exports.sleep = void 0;
const eosio_1 = require("@greymass/eosio");
const chalk_1 = __importDefault(require("chalk"));
const eosio_2 = require("./eosio");
const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.sleep = sleep;
async function cronRunner(jobs, cutoff) {
    const runner = async () => {
        for (const job of jobs) {
            try {
                console.log('Starting:', chalk_1.default.green.bold.inverse(job.name));
                await job();
            }
            catch (error) {
                console.error('cronRunner Error:', error.toString());
            }
        }
    };
    const killSwitch = () => new Promise((res, reject) => setTimeout(() => reject(new Error("Timeout!!!!")), cutoff));
    await Promise.race([runner(), killSwitch()]);
    process.exit();
}
exports.cronRunner = cronRunner;
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
exports.shuffle = shuffle;
async function accountExists(name) {
    const validRegex = new RegExp('(^[a-z1-5.]{0,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)');
    if (typeof name !== 'string')
        return false;
    if (!validRegex.test(name))
        return false;
    try {
        const result = await eosio_2.getAccount(eosio_1.Name.from(name));
        if (result)
            return true;
        else
            return false;
    }
    catch (error) {
        console.log("can't find account", error.toString());
        return false;
    }
}
exports.accountExists = accountExists;
//# sourceMappingURL=utils.js.map