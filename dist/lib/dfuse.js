"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.client4 = exports.client3 = exports.client2 = exports.client1 = void 0
const client_1 = require("@dfuse/client")
global.fetch = require("node-fetch")
global.WebSocket = require("ws")
exports.client1 = (0, client_1.createDfuseClient)({
  apiKey: "b9843b0f023c3f0852f6c6c0618201d2",
  network: "eos.dfuse.eosnation.io",
  streamClientOptions: {
    autoDisconnectSocket: false,
    autoRestartStreamsOnReconnect: true,
    socketOptions: { autoReconnect: true, keepAlive: true }
  }
})
exports.client2 = (0, client_1.createDfuseClient)({
  apiKey: "a4ecdf66bfb59fd39ec51504e68b0c30",
  network: "eos.dfuse.eosnation.io",
  streamClientOptions: {
    autoDisconnectSocket: false,
    autoRestartStreamsOnReconnect: true,
    socketOptions: { autoReconnect: true, keepAlive: true }
  }
})
exports.client3 = (0, client_1.createDfuseClient)({
  apiKey: "b92efb257f872db0bdde8c1d7d62f6f2",
  network: "eos.dfuse.eosnation.io",
  streamClientOptions: {
    autoDisconnectSocket: false,
    autoRestartStreamsOnReconnect: true,
    socketOptions: { autoReconnect: true, keepAlive: true }
  }
})
exports.client4 = (0, client_1.createDfuseClient)({
  authentication: false,
  network: "eos.dfuse.eosnation.io",
  streamClientOptions: {
    autoDisconnectSocket: false,
    autoRestartStreamsOnReconnect: true,
    socketOptions: { autoReconnect: true, keepAlive: true }
  }
})
//# sourceMappingURL=dfuse.js.map
