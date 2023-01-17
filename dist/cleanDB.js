"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ms_1 = __importDefault(require("ms"));
const db_1 = __importDefault(require("./lib/db"));
async function init() {
    try {
        const oldPowerUps = await db_1.default.dopowerup.deleteMany({ where: { time: { lt: Date.now() - (0, ms_1.default)("48h") } } });
        console.log("Removed oldPowerUps", oldPowerUps.count);
        const rpcErrors = await db_1.default.rpcErrors.deleteMany({ where: { time: { lt: Date.now() - (0, ms_1.default)("48h") } } });
        console.log("Removed rpcErrors", rpcErrors);
    }
    catch (error) {
        console.log(error.toString());
    }
}
init();
setInterval(init, (0, ms_1.default)("60m"));
//# sourceMappingURL=cleanDB.js.map