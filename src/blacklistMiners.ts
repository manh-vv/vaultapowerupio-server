import db from "lib/db"
import { getAllScopes } from "lib/eosio"

async function init() {
  const webXHolders = await getAllScopes({ code: "webxtokenacc", table: "accounts" })
  console.log(webXHolders.length)
  for (const miner of webXHolders) {
    const result = await db.blacklist.upsert({
      where: { account: miner.toString() },
      create: { account: miner.toString(), reason: "Mining" },
      update: {}
    })
    console.log(result)
  }
}

init().catch(console.error)


