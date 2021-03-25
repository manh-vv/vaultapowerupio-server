const ms = require('ms')

module.exports = {
  apps: [
    {
      name: 'pwr-worker',
      script: 'pwr-worker.js',
      args: null,
    },
    {
      name: 'watcher',
      script: 'powerupWatcher.js',
      args: null,
    },
    // {
    //   name: 'server',
    //   script: 'server.js',
    //   cwd: './server',
    //   args: null,
    // },
    // {
    //   name: 'proxyServer',
    //   script: 'proxyServer.js',
    //   cwd: './server',
    //   args: null,
    // },
  ]
}
