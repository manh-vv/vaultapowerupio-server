"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../lib/db.js"));
async function write() {
    try {
        const users = await db_1.default.user.findMany();
        console.log(users.length);
    }
    catch (error) {
        console.error(error);
    }
}
write().finally(() => db_1.default.$disconnect());
//# sourceMappingURL=migrateData.js.map