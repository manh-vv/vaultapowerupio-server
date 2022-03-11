"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const greenlock_proxy_1 = __importDefault(require("greenlock-proxy"));
async function init() {
    try {
        var proxy = new greenlock_proxy_1.default({
            maintainerEmail: "john@boid.com",
            staging: false
        });
        proxy.register(["api.eospowerup.io"], ["http://localhost:3000"]);
        proxy.start();
    }
    catch (error) {
        console.error('proxy error:', error);
        process.kill(process.pid);
    }
}
init();
//# sourceMappingURL=proxyServer.js.map