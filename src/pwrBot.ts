require('dotenv').config()
import env from './lib/env'
import { getAccount, doAction, getFullTable, getResouceCosts, ResourceCosts, getAllScopes } from './lib/eosio'
import ms from 'ms'
import { shuffle } from './lib/utils'
import { doAutoPowerup, resourcesCosts } from './lib/serverActions'
import { Name, NameType, PermissionLevel } from '@greymass/eosio'
import { Autobuyram, Autopowerup, WatchlistRow } from './lib/types/eospowerupio.types'

async function autoBuyRam(payer: Name, watch: WatchlistRow) {
  doAction('autobuyram', Autobuyram.from({ payer, watch_account: watch.account }), null, [PermissionLevel.from({ actor: env.workerAccount, permission: env.workerPermission }), PermissionLevel.from({ actor: env.contractAccount, permission: "workers" })])
}

async function getAccountBw(account: Name) {
  const resources = await getAccount(account)
  const msAvailable = resources.cpu_limit.available.toNumber() / 1000
  // console.log("Remaining CPU Ms:", msAvailable);
  const netAvailable = resources.net_limit.available.toNumber() / 1000
  // console.log("Remaining Net kb:", netAvailable);
  const quota = resources.ram_quota
  const usage = resources.ram_usage
  const available = quota.toNumber() - usage.toNumber()
  const remainingKb = available / 1000
  return { msAvailable, netAvailable, resources, remainingKb }
}

async function autoPowerup(owner: Name, watch: WatchlistRow, doNet: Boolean = false) {
  console.log(' ');
  console.log('AutoPowerUp Triggered for:', watch.account.toString());
  console.log(' ');

  let cpu = Math.max(watch.powerup_quantity_ms.toNumber(), 5)
  let net = Math.max(watch.powerup_quantity_ms.toNumber() * 3, 150)
  // if (doNet) net *= 5

  doAutoPowerup(owner, watch.account, cpu, net).then(el => {
    const receipt = el.receipts[0]
    if (receipt) {
      console.log(' ');
      console.log('PowerUp Issued:', owner.toString(), watch.account.toString());
      console.log('CPU:', cpu);
      console.log('NET:', net);
      console.log(receipt.url + ": " + receipt.receipt.id);
      console.log(' ');
    } else {
      console.log(' ');
      console.error('PowerUp Error:', owner.toString(), watch.account.toString());
      console.error('CPU:', cpu);
      console.error('NET:', net);
      console.error(el.errors);
      console.log(' ');
    }
  })
}

async function checkWatchAccount(owner, watch: WatchlistRow) {
  const { msAvailable, netAvailable, remainingKb } = await getAccountBw(watch.account)
  console.log('Available:', watch.account.toString(), "CPU:", msAvailable, "NET:", netAvailable, "RAM:", remainingKb);

  if (watch.min_cpu_ms.toNumber() > 0) {
    if (msAvailable <= watch.min_cpu_ms.toNumber()) autoPowerup(owner, watch)
    if (netAvailable <= watch.min_cpu_ms.toNumber() / 4) autoPowerup(owner, watch, true)
  }
  if (watch.min_kb_ram.toNumber() > 0 && watch.buy_ram_quantity_kb.toNumber() > 0) {
    if (remainingKb <= watch.min_kb_ram.toNumber()) autoBuyRam(owner, watch)
  }
}

async function init(owner?: NameType) {
  try {
    if (owner) owner = Name.from(owner)
    console.time('totalRun')
    let owners: NameType[]
    if (!owner) owners = await getAllScopes({ code: env.contractAccount, table: "account" })
    else owners = [owner]
    // console.log('Owners:', owners.length);

    for (const owner of shuffle(owners)) {
      // console.log("Owner:", owner.toString())
      let watchAccounts: WatchlistRow[] = []
      watchAccounts = (await getFullTable({ tableName: "watchlist", scope: owner, type: WatchlistRow })).filter(el => el.active)
      for (const watch of shuffle(watchAccounts)) {
        // console.time('checkWatch')
        await Promise.race([
          checkWatchAccount(owner, watch),
          new Promise((res, reject) => setTimeout(() => reject(new Error("checkWatchAccount Timeout!")), ms('8s')))
        ]).catch(err => console.error(err.toString(), owner, watch))
        // console.timeEnd('checkWatch')
      }
    }
  } catch (error) {
    console.error('pwrBot error:', error)
  }
  console.timeEnd('totalRun')
}

async function loop() {
  await init(process.argv[2])
  return loop()
}
loop()
