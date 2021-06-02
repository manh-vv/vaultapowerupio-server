module.exports = {
  apps: [
    {
      name: "listener-transfers",
      cwd: "./dist/",
      script: "./dfusePoller.js",
      args: 'transfer',
      env: {
        CHAIN: "eos"
      }
    },
    {
      name: "listener-logbuyram",
      cwd: "./dist/",
      script: "./dfusePoller.js",
      args: 'logbuyram',
      env: {
        CHAIN: "eos"
      }
    },
    {
      name: "listener-logpowerup",
      cwd: "./dist/",
      script: "./dfusePoller.js",
      args: 'logpowerup',
      env: {
        CHAIN: "eos"
      }
    },
    {
      name: "tgBot",
      cwd: "./dist/",
      script: "./tgBot.js",
      args: null,
      env: {
        CHAIN: "eos"
      }
    },
    {
      name: "generateStats",
      cwd: "./dist/",
      script: "./generateStats.js",
      args: null,
      env: {
        CHAIN: "eos"
      }
    },
    {
      name: "refundSmallBal",
      cwd: "./dist/",
      script: "./refundSmallBal.js",
      args: null,
      env: {
        CHAIN: "eos"
      }
    },
    {
      name: "server",
      cwd: "./dist/",
      script: "./server.js",
      env: {
        CHAIN: "eos",
        NODE_ENV: "production"
      }
    },
    {
      name: "proxyServer",
      cwd: "./dist/",
      script: "./proxyServer.js",
      env: {
        CHAIN: "eos",
        NODE_ENV: "production"
      }
    },
    {
      name: "pwrBot",
      cwd: "./dist/",
      script: "./pwrBot.js",
      env: {
        CHAIN: "eos",
        NODE_ENV: "production"
      }
    }
  ]
};
