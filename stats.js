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
    // stats.totalWatched = 0
    // stats.owners = 0
    let totalWatched = 0
    let i = 0
    const result = (await eosjs(null,'https://boid-api-on-eos.animusystems.com').api.rpc.get_table_by_scope({ code: "eospowerupio", table: "account", limit: -1 })).rows.filter(el => el.count > 0).map(el => el.scope)
    stats.owners = result.length
    console.log('Owners', stats.owners)
    getResults = []
    for (owner of result) {
      getResults.push(new Promise((res,rej) => {
        setTimeout(() => {
          tryExec(() => {
            eosjs(null,'https://boid-api-on-eos.animusystems.com',true).api.rpc.get_table_rows({ code: 'eospowerupio', scope: owner, table: "watchlist", limit: -1 })
            .then(el => {
              totalWatched += el.rows.length
              res()
            }).catch(rej)
          })
        }, i * 1000)
        i++
      }))
    }
    await Promise.all(getResults)
    stats.totalWatched = totalWatched
    console.log(stats);
    mixpanel.track('stats',stats)
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