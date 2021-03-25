const env = require('./.env')
const { api, rpc } = require('./eosjs')(env.keys, 'https://eos.greymass.com')
const ms = require('ms')
const watchAccounts = require('./watchAccounts.json')
const random = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)

async function init() {
  try {
    for (const account of watchAccounts) {
      console.log(account)
      const existingus = (await api.rpc.get_account(account)).cpu_limit.available
      const availableMs = existingus/1000
      console.log("Available Ms:", Number(availableMs).toLocaleString())
      if (availableMs > 20) continue
      const transact = await api.transact({
        actions: [{
          account: 'eosio',
          name: 'powerup',
          authorization: [{ actor: env.workerAccount, permission: env.workerPermission }],
          data: {
            payer: env.workerAccount,
            receiver: account,
            days: 1,
            net_frac: 0,
            cpu_frac: 3000000000,
            max_payment: "0.1000 EOS"
          },
        }]
      }, {
        blocksBehind: 12,
        expireSeconds: 10,
        broadcast: true
      }).catch(er => console.log(er.toString()))
      if (transact) console.log(transact.transaction_id)
      const cpuAfter = (await api.rpc.get_account(account)).cpu_limit.available
      console.log("cpuAfter:", Number(cpuAfter).toLocaleString(), "\n")
    }
  } catch (error) {
    console.error(error)
  }
}
init()
setInterval(init, ms('30s'))
