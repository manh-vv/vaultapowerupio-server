const { api, rpc } = require('./eosjs.js')(null, 'https://boid-api-on-eos.animusystems.com')

var stats = {
  owners: 0,
  totalWatched: 0
}

async function updateStats() {
  try {
    // stats.totalWatched = 0
    // stats.owners = 0
    let totalWatched = 0
    let i = 0
    const result = (await api.rpc.get_table_by_scope({ code: "eospowerupio", table: "account", limit: -1 })).rows.filter(el => el.count > 0).map(el => el.scope)
    stats.owners = result.length
    console.log('Owners', stats.owners)
    getResults = []
    for (owner of result) {
      getResults.push(new Promise((res) => {
        setTimeout(() => {
          api.rpc.get_table_rows({ code: 'eospowerupio', scope: owner, table: "watchlist", limit: -1 }).then(el => {
            stats.totalWatched += el.rows.length
            res()
          })
        }, i * 100)
      }))
    }
    await Promise.all(getResults)
    console.log(stats);
    stats.totalWatched = totalWatched
    // process.on('beforeExit', () => {
    //   console.log(stats);
    //   // console.log('Total Watch Accounts:',stats.totalWatched)
    // })
  } catch (error) {
    console.error(error);
  }
}

if (require.main === module) {
  console.log("Starting: stats")
  updateStats(...process.argv.slice(2)).catch(console.error)
}

module.exports = { stats, updateStats }