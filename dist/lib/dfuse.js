"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@dfuse/client");
global.fetch = require("node-fetch");
global.WebSocket = require("ws");
const client = client_1.createDfuseClient({
    apiKey: 'b9843b0f023c3f0852f6c6c0618201d2',
    network: "eos.dfuse.eosnation.io", streamClientOptions: {
        autoDisconnectSocket: false,
        autoRestartStreamsOnReconnect: true
    }
});
exports.default = client;
//# sourceMappingURL=dfuse.js.map