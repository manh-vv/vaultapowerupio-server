import { log } from "console"
import db from "lib/db"

async function main() {
  const recentFree = await db.dopowerup.findMany({ where: { payer: "eospowerupio" } })
  log(recentFree.length)
  let acctMap:Record<string, number> = {}
  for (const pwrUp of recentFree) {
    if (acctMap[pwrUp.receiver]) acctMap[pwrUp.receiver]++
    else acctMap[pwrUp.receiver] = 1
  }
  log(Object.keys(acctMap).length)
  const abusers = Object.entries(acctMap).filter(([name, num]) => {
    // log(name, num)
    return num > 12
  })
  log(abusers)
  for (const [account, num] of abusers) {
    await db.blacklist.upsert({
      where: { account },
      create: { account, reason: "Abuse" },
      update: {}
    })
  }
}
main().catch(console.error)
