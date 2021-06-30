import { createDfuseClient, createHttpClient, createStreamClient } from '@dfuse/client'
global.fetch = require("node-fetch");
global.WebSocket = require("ws");
// const { createDfuseClient } = require("@dfuse/client")
//apiKey: 'a4ecdf66bfb59fd39ec51504e68b0c30'
const client = createDfuseClient({
  apiKey: 'b9843b0f023c3f0852f6c6c0618201d2',
  // authentication: false,
  network: "eos.dfuse.eosnation.io", streamClientOptions: {
    autoDisconnectSocket: false,
    autoRestartStreamsOnReconnect: true
  }
})

export default client