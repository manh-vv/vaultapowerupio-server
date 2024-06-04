"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObject = void 0;
const antelope_1 = require("@wharfkit/antelope");
const console_1 = require("console");
const eospowerupio_types_1 = require("./lib/types/eospowerupio.types.js");
function toObject(data) {
    return JSON.parse(JSON.stringify(data, (key, value) => typeof value === "bigint"
        ? value.toString()
        : value));
}
exports.toObject = toObject;
async function init() {
    try {
        const acct = antelope_1.Name.from("boorad.test");
        const row = eospowerupio_types_1.AccountRow.from({ balance: "22.2000 TLOS" });
        (0, console_1.log)(toObject(row));
    }
    catch (error) {
        console.error(error);
    }
}
init();
//# sourceMappingURL=test.js.map