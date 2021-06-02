"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@dfuse/client");
global.fetch = require("node-fetch");
global.WebSocket = require("ws");
const client = client_1.createDfuseClient({
    apiKey: 'a4ecdf66bfb59fd39ec51504e68b0c30',
    network: "eos.dfuse.eosnation.io", streamClientOptions: {
        autoDisconnectSocket: false,
        autoRestartStreamsOnReconnect: true
    }
});
exports.default = client;
//# sourceMappingURL=dfuse.js.map