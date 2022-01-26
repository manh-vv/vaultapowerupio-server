import db from "./lib/db";
import { Transfer } from "@prisma/client";
import fs from 'fs-extra'
import { Prisma } from "@prisma/client";
import { create } from "ts-node";
async function createList() {
  try {
    const results = await db.transfer.findMany(
      { where: { to: "eospowerupio", memo: "donation" } }
    )
    const pomelo = await db.transfer.findMany(
      { where: { to: "app.pomelo", memo: { contains: "grant:eospowerupio" } } }
    )
    console.log(results.length);
    let donations = results.concat(pomelo)
    console.log(donations.length);

    await fs.writeJson("../airdropList.json", donations, { spaces: 2 })
  } catch (error) {
    console.log(error);
  }
}

async function aggList() {
  try {
    const list: Transfer[] = (await fs.readJSON('../airdropList.json'))
    let newList: any = {}
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
      let data: any = agg[1]
      if (data.donated >= minMint.gold) { newList[agg[0]].gold = 1; totals.gold++ }
      else if (data.donated >= minMint.silver) { newList[agg[0]].silver = 1; totals.silver++ }
      else if (data.donated >= minMint.bronze) { newList[agg[0]].bronze = 1; totals.bronze++ }
    }
    console.log(totals);
    await fs.writeJson('../aggList.json', newList, { spaces: 2 })
  } catch (error) {
    console.log(error);
  }
}

createList().then(aggList).finally(() => { db.$disconnect() })

