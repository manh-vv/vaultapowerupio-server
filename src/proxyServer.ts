// import GreenlockProxy from 'greenlock-proxy'
const GreenlockProxy = require("greenlock-proxy")

async function init() {
  try {
    let proxy = new GreenlockProxy({
      maintainerEmail: "john@boid.com", // your email
      staging: false
    })

    // Just bind your domain to internal address - common example
    proxy.register(["api.eospowerup.io"], ["http://localhost:3000"])
    proxy.register(["ipfs.eospowerup.io"], ["http://localhost:3333"])
    proxy.register(["umami.boid.com"], ["http://localhost:4000"])


    // Start proxiyng
    proxy.start()
  } catch (error) {
    console.error("proxy error:", error)
    process.kill(process.pid)
  }
}


init()
