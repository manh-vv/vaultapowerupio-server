import { createDfuseClient, createHttpClient, createStreamClient } from "@dfuse/client"
global.fetch = require("node-fetch")
global.WebSocket = require("ws")
// const { createDfuseClient } = require("@dfuse/client")
//apiKey: 'a4ecdf66bfb59fd39ec51504e68b0c30'
//apiKey: 'b9843b0f023c3f0852f6c6c0618201d2'
export const client1 = createDfuseClient({
  apiKey: "b9843b0f023c3f0852f6c6c0618201d2",
  network: "eos.dfuse.eosnation.io",
  streamClientOptions: {
    autoDisconnectSocket: false,
    autoRestartStreamsOnReconnect: true,
    socketOptions: { autoReconnect: true, keepAlive: true }
  }
})

export const client2 = createDfuseClient({
  apiKey: "a4ecdf66bfb59fd39ec51504e68b0c30",
  network: "eos.dfuse.eosnation.io",
  streamClientOptions: {
    autoDisconnectSocket: false,
    autoRestartStreamsOnReconnect: true,
    socketOptions: { autoReconnect: true, keepAlive: true }
  }
})
export const client3 = createDfuseClient({
  apiKey: "b92efb257f872db0bdde8c1d7d62f6f2",
  network: "eos.dfuse.eosnation.io",
  streamClientOptions: {
    autoDisconnectSocket: false,
    autoRestartStreamsOnReconnect: true,
    socketOptions: { autoReconnect: true, keepAlive: true }
  }
})
export const client4 = createDfuseClient({
  authentication: false,
  network: "eos.dfuse.eosnation.io",
  streamClientOptions: {
    autoDisconnectSocket: false,
    autoRestartStreamsOnReconnect: true,
    socketOptions: { autoReconnect: true, keepAlive: true }
  }
})
