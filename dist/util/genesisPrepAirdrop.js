"use strict"
let __importDefault = (this && this.__importDefault) || function(mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod }
}
Object.defineProperty(exports, "__esModule", { value: true })
const db_1 = __importDefault(require("../lib/db"))
const fs_extra_1 = __importDefault(require("fs-extra"))
async function createList() {
  try {
    const results = await db_1.default.transfer.findMany({ where: { to: "eospowerupio", memo: "donation" } })
    const pomelo = await db_1.default.transfer.findMany({ where: { to: "app.pomelo", memo: { contains: "grant:eospowerupio" } } })
    console.log(results.length)
    let donations = results.concat(pomelo)
    console.log(donations.length)
    await fs_extra_1.default.writeJson("../airdropList.json", donations, { spaces: 2 })
  } catch (error) {
    console.log(error)
  }
}
async function aggList() {
  try {
    const list = (await fs_extra_1.default.readJSON("../airdropList.json"))
    let newList = {}
    let minMint = {
      bronze: 1,
      silver: 3,
      gold: 10
    }
    for (const donation of list) {
      if (newList[donation.from]) {
        newList[donation.from].donated += donation.quantity
        newList[donation.from].times++
      } else {
        newList[donation.from] = {
          donated: donation.quantity,
          times: 1
        }
      }
    }
    let totals = {
      bronze: 0,
      silver: 0,
      gold: 0
    }
    for (const agg of Object.entries(newList)) {
      let data = agg[1]
      if (data.donated >= minMint.gold) {
        newList[agg[0]].gold = 1
        totals.gold++
      } else if (data.donated >= minMint.silver) {
        newList[agg[0]].silver = 1
        totals.silver++
      } else if (data.donated >= minMint.bronze) {
        newList[agg[0]].bronze = 1
        totals.bronze++
      }
    }
    console.log(totals)
    await fs_extra_1.default.writeJson("../aggList.json", newList, { spaces: 2 })
  } catch (error) {
    console.log(error)
  }
}
createList().then(aggList).finally(() => { db_1.default.$disconnect() })
//# sourceMappingURL=genesisPrepAirdrop.js.map
