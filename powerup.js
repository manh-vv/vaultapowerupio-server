const { Resources } = require('@greymass/eosio-resources')
const fetch = require('node-fetch')
const env = require('./.env.js')
const resources = new Resources({ fetch, url: 'https://eos.greymass.com' })
const { api, rpc } = require('./eosjs')(env.keys, env.endpoint)
const sleep = ms => new Promise(res => setTimeout(res, ms))


const tapos = {
  blocksBehind: 16,
  expireSeconds: 30,
  broadcast: true
}
const fracPwr = 1e8

async function getAccountBw(account) {
  const resources = (await api.rpc.get_account(account))
  // console.log(resources);
  const msAvailable = resources.cpu_limit.available / 1000
  console.log("Remaining CPU Ms:",msAvailable);
  const netAvailable = resources.net_limit.available / 1000
  console.log("Remaining Net kb:",netAvailable);
  return {msAvailable,netAvailable}
}

const methods = {
  /**
   * 
   * @param {string} payer account paying for the powerup(auth required)
   * @param {number} quantity amount of CPU time to reserve   
   * @param {string} [receiver] account to receive CPU
   * @param {string=} [payerPermission = 'active'] custom permission to use for the powerup action
   * @param {number=} [maxPayment = 1] max EOS to spend for this powerup
   */
  async powerup(payer, quantity, receiver, payerPermission,maxPayment) {
    try {
      if (!payer) throw ("Missing Account Name")
      if (!quantity) throw ("Missing Quantity")
      if (!receiver) receiver = payer
      if (!payerPermission) payerPermission = 'active'
      if (!maxPayment) maxPayment = 1
      console.log('Receiver:', receiver)
      await getAccountBw(receiver)
      quantityCpu = parseFloat(quantity) * 0.999
      quantityNet = parseFloat(quantity) * 0.001
      
      const powerup = await resources.v1.powerup.get_state()
      const sample = await resources.getSampledUsage()    
      
      let cpu_frac = powerup.cpu.frac_by_ms(sample, quantityCpu)
      console.log('cpu_frac:',cpu_frac);
      let net_frac = powerup.net.frac_by_kb(sample, Math.max(quantityCpu/50,0.5))
      console.log('net_frac:',net_frac)
      // return
      cpu_frac = parseInt(cpu_frac * 1)
      net_frac = parseInt(net_frac * 1)
      const pwrAction = {
        account: 'eosio',
        name: 'powerup',
        authorization: [{ actor: payer, permission: payerPermission }],
        data: {
          cpu_frac, net_frac, days: 1,
          max_payment: Number(maxPayment).toFixed(4) + ' EOS',
          payer, receiver
        }
      }

      const result = await api.transact({ actions: [pwrAction]},tapos)
      console.log(`https://bloks.io/transaction/${result.transaction_id}`)
      // await sleep(1000)
      await getAccountBw(receiver)

      return result.transaction_id

      const accountData = await api.rpc.get_account(receiver)
      console.log(accountData);

      } catch (error) {
        console.error(error.toString())
        throw new Error(error.toString())
      }
    }
}



if(process.argv[2] && require.main === module) {
    console.log("Starting:", process.argv[2])
methods.powerup(...process.argv.slice(2)).catch(console.error)
  .then((result) => console.log('Finished'))
} else console.error("must Specify account and quantity for powerup")

module.exports = methods.powerup