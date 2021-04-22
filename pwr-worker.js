const env = require('./.env')
const eosjs = require('./eosjs')
const ms = require('ms')
const contractAccount = env.contractAccount

var sample
/**
 * @type(PowerUpState)
 */
var powerup


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

async function autoPowerup(owner, watch, net) {
  let { doAction } = eosjs()
  console.log("Create Powerup for " + watch.powerup_quantity_ms + " Ms");
  let net_frac = 0
  let cpu_frac = 0

  if (net) {
    console.log('Performing NET Powerup');
    net_frac = powerup.net.frac_by_kb(sample, Math.max(watch.powerup_quantity_ms, 10))
  } else {
    cpu_frac = powerup.cpu.frac_by_ms(sample, Math.max(watch.powerup_quantity_ms, 5))
    net_frac = powerup.net.frac_by_kb(sample, Math.max(watch.powerup_quantity_ms/5, 1))
  }

  const max_payment = "2.2000 EOS"
  doAction('autopowerup', { payer: owner, watch_account: watch.account, net_frac: parseInt(net_frac), cpu_frac: parseInt(cpu_frac), max_payment })
}

async function autoBuyRam(payer, watch) {
  let { doAction } = eosjs()
  doAction('autobuyram', { payer, watch_account: watch.account })
}

async function getAccountBw(account) {
  let { api } = eosjs()
  const resources = (await api.rpc.get_account(account))
  // console.log(resources);
  const msAvailable = resources.cpu_limit.available / 1000
  console.log("Remaining CPU Ms:", msAvailable);
  const netAvailable = resources.net_limit.available / 1000
  console.log("Remaining Net kb:", netAvailable);
  return { msAvailable, netAvailable,resources }
}

async function getAccountKb(account,resources) {
  if(!resources) {
    let { api } = eosjs()
    resources = (await api.rpc.get_account(account))
  }
  const quota = resources.ram_quota
  const usage = resources.ram_usage
  const available = quota - usage
  const remainingKb = available / 1000
  console.log('RAM kb Remaining:', remainingKb);
  return remainingKb
}

async function tryExec(exec, retry) {
  const timeout = 5000
  if (!retry) retry = 0
  try {
    const result = await Promise.race([
      exec(),
      new Promise((res,reject) => setTimeout(() => reject(new Error("tryExec Timeout!")), timeout))
    ])
    return result
  } catch (error) {
    console.error(error)
    console.log("RETRYING", retry);
    retry ++
    if (retry < 5) return tryExec(exec, retry)
    else return
  }
}

async function checkWatchAccount(owner,watch) {
  // console.log('\n');
  console.log('Checking:', watch.account);
  const { msAvailable, netAvailable,resouces } = await tryExec(() => getAccountBw(watch.account))

  if (watch.min_cpu_ms > 0) {
    if (msAvailable <= watch.min_cpu_ms) tryExec(() => autoPowerup(owner, watch))
    if (netAvailable <= watch.min_cpu_ms / 3) tryExec(() => autoPowerup(owner, watch, true))
  }
  if (watch.min_kb_ram > 0 && watch.buy_ram_quantity_kb > 0) {
    const kbAvailable = await tryExec(() => getAccountKb(watch.account,resouces))
    if (kbAvailable <= watch.min_kb_ram) tryExec(() => autoBuyRam(owner, watch))
  }
}

async function init(owner) {
  try {
    console.time('totalRun')
    let { api, resources } = eosjs()
    await tryExec(async () => {
      sample = await resources.getSampledUsage()
      powerup = await resources.v1.powerup.get_state()
    })
    let owners
    if(!owner) owners = await tryExec(async () => { return shuffle((await api.rpc.get_table_by_scope({ code: "eospowerupio", table: "account", limit: -1 })).rows.filter(el => el.count > 0).map(el => el.scope)) })
    else owners = [owner]
    console.log('Owners:',owners.length);
    for (owner of owners) {
      let { api, resources } = eosjs()
      powerup = await tryExec(async()=>await resources.v1.powerup.get_state())
      // console.log('\n');
      console.log("Owner:",owner)
      let watchAccounts = []
      watchAccounts = await tryExec(async()=> shuffle((await api.rpc.get_table_rows({ code: 'eospowerupio', scope: owner, table: "watchlist", limit: -1 })).rows.filter(el => el.active == 1)))

      for (watch of watchAccounts) {
        console.time('checkWatch')
        await Promise.race([
          checkWatchAccount(owner,watch),
          new Promise((res,reject) => setTimeout(() => reject(new Error("checkWatchAccount Timeout!")), ms('5s')))
        ]).catch(err => console.error(err.toString(),owner,watch))
        console.timeEnd('checkWatch')
      }
    }
  } catch (error) {
    console.error('pwr-worker error:',error)
    // ret
  }
  console.timeEnd('totalRun')
  process.exit()
}


async function start(watcher){
  await Promise.race([
    init(watcher),
    new Promise((res,reject) => setTimeout(() => reject(new Error("Init Timeout!")), ms('15m')))
  ]).catch(err => {
    console.error(err.toString())
    process.exit()
  })
}


if (require.main === module) {
  console.log("Starting: pwr-worker")
  start(...process.argv.slice(2)).catch(console.error)
    .then((result) => console.log('Finished'))
}

module.exports = start

