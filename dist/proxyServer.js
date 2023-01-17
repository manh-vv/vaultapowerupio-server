const GreenlockProxy = require("greenlock-proxy");
async function init() {
    try {
        let proxy = new GreenlockProxy({
            maintainerEmail: "john@boid.com",
            staging: false
        });
        proxy.register(["api.eospowerup.io"], ["http://localhost:3000"]);
        proxy.register(["ipfs.eospowerup.io"], ["http://localhost:3333"]);
        proxy.start();
    }
    catch (error) {
        console.error("proxy error:", error);
        process.kill(process.pid);
    }
}
init();
//# sourceMappingURL=proxyServer.js.map