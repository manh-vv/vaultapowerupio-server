"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../lib/db"));
const fs_extra_1 = __importDefault(require("fs-extra"));
async function init() {
    try {
        const users = await db_1.default.user.findMany();
        await fs_extra_1.default.writeJSON('../users.json', users);
    }
    catch (error) {
        console.error(error);
    }
}
init();
//# sourceMappingURL=migrateData.js.map