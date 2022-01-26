import db from "./lib/db";
import { Transfer } from "@prisma/client";
import fs from 'fs-extra'


async function createList() {
  try {
    const powerup = await db.transfer.aggregate({ where: { to: "animus.inc", memo: { contains: "grant:eospowerupio" } }, _sum: { quantity: true } })
    const eosioibc = await db.transfer.aggregate({ where: { to: "animus.inc", memo: { contains: "grant:eosioibc" } }, _sum: { quantity: true } })
    const daclify = await db.transfer.aggregate({ where: { to: "animus.inc", memo: { contains: "grant:daclify" } }, _sum: { quantity: true } })
    const boiduniverse = await db.transfer.aggregate({ where: { to: "animus.inc", memo: { contains: "grant:boiduniverse" } }, _sum: { quantity: true } })
    const donated = {
      powerup: powerup._sum.quantity,
      eosioibc: eosioibc._sum.quantity,
      daclify: daclify._sum.quantity,
      boiduniverse: boiduniverse._sum.quantity
    }
    const powerupClaim = await db.transfer.aggregate({ where: { from: "claim.pomelo", to: "animus.inc", memo: { contains: "eospowerupio" } }, _sum: { quantity: true } })
    const eosioibcClaim = await db.transfer.aggregate({ where: { from: "claim.pomelo", to: "animus.inc", memo: { contains: "eosioibc" } }, _sum: { quantity: true } })
    const daclifyClaim = await db.transfer.aggregate({ where: { from: "claim.pomelo", to: "animus.inc", memo: { contains: "daclify" } }, _sum: { quantity: true } })
    const boiduniverseClaim = await db.transfer.aggregate({ where: { from: "claim.pomelo", to: "animus.inc", memo: { contains: "boiduniverse" } }, _sum: { quantity: true } })
    const matched = {
      powerup: powerupClaim._sum.quantity,
      eosioibc: eosioibcClaim._sum.quantity,
      daclify: daclifyClaim._sum.quantity,
      boiduniverse: boiduniverseClaim._sum.quantity
    }
    const results = { donated, matched }
    await fs.writeJson("../pomeloList.json", results, { spaces: 2 })
  } catch (error) {
    console.log(error);
  }
}


createList().finally(() => { db.$disconnect() })

