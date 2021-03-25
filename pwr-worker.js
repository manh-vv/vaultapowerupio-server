const env = require('./.env')
const { api,tapos } = require('./eosjs')(env.keys, env.endpoint)
const { Resources } = require('@greymass/eosio-resources')
const fetch = require('node-fetch')
const resources = new Resources({ fetch, url:env.endpoint})
const ms = require('ms')
const contractAccount = env.contractAccount

var sample
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

async function doAction(name, data, account, actor,permission) {
  try {
    if (!data) data = {}
    if (!account) account = contractAccount
    if (!actor) actor = env.workerAccount
    if (!permission) permission = env.workerPermission
    console.log("Do Action:", name, data)
    const authorization = [{ actor, permission }]
    const result = await api.transact({
      // "delay_sec": 0,
      actions: [{ account, name, data, authorization }]
    }, tapos)
    const txid = result.transaction_id
    console.log(`https://bloks.io/transaction/` + txid)
    // console.log(txid)
    return result
  } catch (error) {
    console.error(error.toString())
    if (error.json) console.error("Logs:", error.json?.error?.details[1]?.message)
  }
}

async function autoPowerup(owner,watch){
  let cpu_frac = powerup.cpu.frac_by_ms(sample, watch.powerup_quantity_ms)
  // console.log(cpu_frac);
  // let net_frac = parseInt(cpu_frac /1e7)
  let net_frac = 0
  // console.log(net_frac);
  const max_payment = "0.1000 EOS"
  await doAction('autopowerup',{payer:owner,watch_account:watch.account,net_frac,cpu_frac,max_payment})
}
async function autoBuyRam(payer,watch) {
  await doAction('autobuyram',{payer,watch_account:watch.account})
}

async function getAccountMs(account) {
  const existingus = (await api.rpc.get_account(account)).cpu_limit.available
  console.log("Remaining Ms:",existingus/1000);
  return existingus / 1000
}

async function getAccountKb(account) {
  const existingBytes = (await api.rpc.get_account(account)).total_resources.ram_bytes
  console.log("Remaining Kb:",existingBytes/1000);
  return existingBytes / 1000
}

async function init(){
  try {
    sample = await resources.getSampledUsage()   
    powerup = await resources.v1.powerup.get_state()
    const watchScopes = shuffle((await api.rpc.get_table_by_scope({code:"eospowerupio",table:"watchlist",limit:-1})).rows.filter(el => el.count > 0).map(el => el.scope))

    for (owner of watchScopes) {
      powerup = await resources.v1.powerup.get_state()
      console.log(owner)
      const watchAccounts = shuffle((await api.rpc.get_table_rows({code:'eospowerupio',scope:owner,table:"watchlist",limit:-1})).rows.filter(el => el.active == 1))
      for (watch of watchAccounts) {
        console.log('Checking:',watch.account);
        if(watch.min_cpu_ms > 0) {
          const msAvailable = await getAccountMs(watch.account)
          if (msAvailable < watch.min_cpu_ms) await autoPowerup(owner,watch)
         }
        if(watch.min_kb_ram > 0) {
          const kbAvailable = await getAccountKb(watch.account)
          if (kbAvailable < watch.min_kb_ram) await autoBuyRam(owner,watch)
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}
init()