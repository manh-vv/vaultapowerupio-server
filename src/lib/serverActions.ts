import { Asset, Name, NameType, PermissionLevel } from "@greymass/eosio"
import { doAction, getFullTable, getResouceCosts, ResourceCosts } from "./eosio"
import { Autopowerup, Dopowerup as DoPowerUp, Logpowerup } from "./types/eospowerupio.types"
import { Dopowerup } from "@prisma/client"
import * as res from "@greymass/eosio-resources"
import db from "./db"
import env from "./env"
import ms from "ms"
import * as nft from "./types/nftTypes"


export let resourcesCosts:ResourceCosts

const freeDailyQuota = 2

setInterval(updateResourceCosts, ms("5 minutes"))
updateResourceCosts()
async function updateResourceCosts() {
  resourcesCosts = await getResouceCosts()
}


export async function doPowerup(payer:NameType, receiver:NameType, cpuQuantityMs:number, netQuantityMs:number) {
  const { cpuMsCost, netKbCost, kbToFrac, msToFrac } = resourcesCosts || await getResouceCosts()
  const max_payment = Asset.from((((cpuMsCost * cpuQuantityMs) + (netKbCost * netQuantityMs)) * 1.05), Asset.Symbol.from("4,EOS"))
  const cpu_frac = msToFrac * cpuQuantityMs
  const net_frac = kbToFrac * netQuantityMs
  console.log("Max Payment:", max_payment.toString())
  const params = DoPowerUp.from({ cpu_frac, max_payment, payer, net_frac, receiver })
  const results = await doAction("dopowerup", params)
  return results
}

export async function doAutoPowerup(payer:NameType, watch_account:NameType, cpuQuantityMs:number, netQuantityMs:number) {
  const { cpuMsCost, netKbCost, kbToFrac, msToFrac } = resourcesCosts || await getResouceCosts()
  const max_payment = Asset.from((((cpuMsCost * cpuQuantityMs) + (netKbCost * netQuantityMs)) * 1.05), Asset.Symbol.from("4,EOS"))
  const cpu_frac = msToFrac * cpuQuantityMs
  const net_frac = kbToFrac * netQuantityMs
  console.log("Max Payment:", max_payment.toString())
  const params:Autopowerup = Autopowerup.from({ cpu_frac, max_payment, payer, net_frac, watch_account })
  const results = await doAction("autopowerup", params, null, [PermissionLevel.from({ actor: env.workerAccount, permission: env.workerPermission }), PermissionLevel.from({ actor: env.contractAccount, permission: "workers" })])
  return results
}

export interface FreePowerupResult {
  status:"success" | "error" | "reachedFreeQuota" | "blacklisted"
  powerupLog?:Logpowerup,
  txid?:string,
  recentPowerups?:Dopowerup[],
  errors?:any[]
  nextPowerup?:number
}
async function checkBlacklist(account:NameType) {
  const result = await db.blacklist.findUnique({ where: { account: account.toString() } })
  return result
}

let nftConfig:nft.NftConfig

export async function loadNftConfig():Promise<nft.NftConfig> {
  if (!nftConfig) {
    const config:nft.Config = nft.Config.from((await getFullTable({ tableName: "config", contract: env.nftContract, type: nft.Config }))[0])
    nftConfig = config.nft
    return nftConfig
  } else return nftConfig
}
// let cachedStakes: Record<string, nft.Staked[]>
export async function loadAccountStakes(account:NameType):Promise<nft.Staked[]> {
  try {
    const accountStaked:nft.Staked[] = await getFullTable({ tableName: "staked", contract: env.nftContract, scope: account, type: nft.Staked })
    return accountStaked
  } catch (error) {
    console.error("loadAccountStakes error:", error)
    return []
  }
}

export async function hasBronzeStake(account:NameType):Promise<boolean> {
  try {
    const config = await loadNftConfig()
    const accountStaked = await loadAccountStakes(account)
    const exists = accountStaked.find((el) => el.template_id.equals(config.bronze_template_id))
    return !!exists
  } catch (error) {
    return false
  }
}

export async function freePowerup(accountName:string | Name, params?:any):Promise<FreePowerupResult> {
  if (typeof accountName == "string") accountName = Name.from(accountName)
  const blacklisted = await checkBlacklist(accountName)
  if (blacklisted) return { status: "blacklisted", errors: [{ blacklisted: blacklisted.reason }] }
  if (accountName.toString().includes(".pcash") || accountName.toString().includes(".ftw")) return { status: "blacklisted", errors: [{ blacklisted: "Abuse" }] }
  const recentPowerups = await db.dopowerup.findMany({
    where: {
      receiver: accountName.toString(),
      payer: env.contractAccount.toString(),
      time: { gte: Date.now() - ms("24hr") }
    },
    orderBy: { time: "desc" }
  })
  console.log("recent Powerups", recentPowerups.length)
  if (recentPowerups.length < freeDailyQuota) {
    const bonusSize = await hasBronzeStake(accountName)
    const cpu = bonusSize ? 6 : 1
    const net = bonusSize ? 40 : 20
    const result = await doPowerup(env.contractAccount, accountName, cpu, net)
    // console.log('DoPowerup Result:', result)
    if (result?.receipts.length > 0) {
      const powerupData = DoPowerUp.from(result.receipts[0].receipt.action_traces[0].act.data)
      const logPowerUpData = Logpowerup.from(result.receipts[0].receipt.action_traces[0].inline_traces[1].inline_traces[0].act.data)
      // console.log(powerupData);
      // console.log('blocktime:', result.receipts[0].receipt.block_time.toString(), Date.parse(result.receipts[0].receipt.block_time.toString()), new Date(result.receipts[0].receipt.block_time).getUTCMilliseconds());
      await db.dopowerup.create({
        data: {
          cpu_frac: powerupData.cpu_frac.toNumber(),
          net_frac: powerupData.net_frac.toNumber(),
          payer: powerupData.payer.toString(),
          receiver: powerupData.receiver.toString(),
          time: Date.parse(result.receipts[0].receipt.block_time.toString() + "z"),
          txid: result.receipts[0].receipt.id.toString(),
          failed: false,
          reversible: true
        }
      })
      return { status: "success", powerupLog: logPowerUpData, txid: result.receipts[0].receipt.id, recentPowerups }
    }
    return { status: "error", errors: result.errors }
  } else {
    // console.log('found recent powerups');
    const oldest = recentPowerups[recentPowerups.length - 1]
    // console.log(oldest);
    const elapsed = Date.now() - parseInt(oldest.time.toString())
    // console.log('elapsed', elapsed);
    const timeLeft = ms("24h") - elapsed
    const nextPowerup = Date.now() + timeLeft
    // console.log('msleft:', timeLeft);
    return { status: "reachedFreeQuota", nextPowerup, recentPowerups }
  }
}


export async function getStats() {
  let stats = await db.stats.findFirst({
    take: 1, orderBy: { createdAt: "desc" }
  })
  console.log(stats)
  stats.createdAt

  try {
    stats.rpcErrorStats = JSON.parse(stats.rpcErrorStats)
  } catch (error) {
    console.error(error)
  }
  return stats
}

// export async function
