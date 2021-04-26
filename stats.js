const eosjs = require('./eosjs.js')
const Mixpanel = require('mixpanel')

// initialize mixpanel client configured to communicate over https
var mixpanel = Mixpanel.init('9ff1909bddc4e74db9192b48f0149941', {
  protocol: 'https'
});

var stats = {
  owners: 0,
  totalWatched: 0
}

async function tryExec(exec, retry) {
  const timeout = 8000
  if (!retry) retry = 0
  try {
    const result = await Promise.race([
      exec(),
      new Promise((res, reject) => setTimeout(() => reject(new Error("tryExec Timeout!")), timeout))
    ])
    return result
  } catch (error) {
    console.error(error)
    console.log("RETRYING", retry);
    retry++
    if (retry < 5) return tryExec(exec, retry)
    else return
  }
}


async function updateStats() {
  try {
    let totalWatched = 0
    let totalDeposited = 0
    let i = 0
    let i2 = 0
    const owners = (await eosjs(null, 'https://boid-api-on-eos.animusystems.com').api.rpc.get_table_by_scope({ code: "eospowerupio", table: "account", limit: -1 })).rows.filter(el => el.count > 0).map(el => el.scope)
    stats.owners = owners.length
    console.log('Owners', stats.owners)
    getResults = []

    owners.forEach(async owner => {
      getResults.push(new Promise((res, rej) => {
        setTimeout(() => {
          tryExec(() => {
            eosjs(null, 'https://boid-api-on-eos.animusystems.com', true).api.rpc.get_table_rows({ code: 'eospowerupio', scope: owner, table: "watchlist", limit: -1 })
              .then(el => {
                totalWatched += el.rows.length
                res()
              })
          })
        }, i * 1000)
        i++
      }))
      getResults.push(new Promise((res, rej) => {
        setTimeout(() => {
          tryExec(() => {
            eosjs(null, 'https://boid-api-on-eos.animusystems.com', true).api.rpc.get_table_rows({ code: 'eospowerupio', scope: owner, table: "account", limit: -1 })
              .then(el => {
                totalDeposited += parseFloat(el.rows[0].balance)
                res()
              })
          }).finally(res)
        }, i2 * 1100)
        i2++
      }))
    })

    await Promise.all(getResults)
    const rpc = eosjs(null, 'https://boid-api-on-eos.animusystems.com').api.rpc
    const eosBal = parseFloat((await rpc.get_currency_balance('eosio.token', 'eospowerupio', "EOS"))[0])
    const sxBal = parseFloat((await rpc.get_currency_balance('token.sx', 'eospowerupio', "SXEOS"))[0])
    const sxStats = (await rpc.get_table_rows({ code: 'vaults.sx', table: 'vault', limit: -1, scope: 'vaults.sx' })).rows
    const sxEOSDeposited = parseFloat(sxStats[0].deposit.quantity)
    const sxEOSSupply = parseFloat(sxStats[0].supply.quantity)
    const sxEOSValue = sxEOSDeposited / sxEOSSupply * sxBal
    const internalEOSBal = parseFloat((await rpc.get_table_rows({ code: 'eospowerupio', table: 'account', limit: -1, scope: 'eospowerupio' })).rows[0].balance)
    const solvency = sxEOSValue + eosBal - totalDeposited

    const extraStats = {
      totalWatched,
      eosBal,
      sxBal,
      sxEOSValue,
      internalEOSBal,
      totalDeposited,
      solvency
    }
    Object.assign(stats, extraStats)
    console.log(stats);
    if (require.main != module) {
      console.log('Send Data to mixpanel...');
      mixpanel.track('stats', Object.assign({},stats))
    }
    return stats

  } catch (error) {
    console.error('Stats Error:', error);
  }
}

if (require.main === module) {
  console.log("Starting: stats")
  updateStats(...process.argv.slice(2)).catch(console.error)
}

module.exports = { stats, updateStats }