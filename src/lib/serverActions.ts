import { Asset, Name, NameType, PermissionLevel } from '@greymass/eosio'
import { doAction, getResouceCosts, ResourceCosts } from './eosio'
import { Dopowerup as DoPowerUp, Logpowerup } from './types/eospowerupio.types'
import { Dopowerup } from '@prisma/client'
import * as res from '@greymass/eosio-resources'
import db from './db'
import env from './env'
import ms from 'ms'

export let resourcesCosts: ResourceCosts

const freeDailyQuota = 2

setInterval(updateResourceCosts, ms('5 minutes'))
updateResourceCosts()
async function updateResourceCosts() {
  resourcesCosts = await getResouceCosts()
}


export async function doPowerup(payer: NameType, receiver: NameType, cpuQuantityMs: number, netQuantityMs: number,) {
  const { cpuMsCost, netKbCost, kbToFrac, msToFrac } = resourcesCosts || await getResouceCosts()
  const max_payment = Asset.from((((cpuMsCost * cpuQuantityMs) + (netKbCost * netQuantityMs)) * 1.05), Asset.Symbol.from("4,EOS"))
  const cpu_frac = msToFrac * cpuQuantityMs
  const net_frac = kbToFrac * netQuantityMs
  console.log('Max Payment:', max_payment.toString());
  const params = DoPowerUp.from({ cpu_frac, max_payment, payer, net_frac, receiver })
  const results = await doAction('dopowerup', params, null, [PermissionLevel.from("eospowerupio@powerup")], [env.keys[1]])
  return results
}

export interface FreePowerupResult {
  status: 'success' | 'error' | 'reachedFreeQuota'
  powerupLog?: Logpowerup,
  txid?: string,
  recentPowerups?: Dopowerup[],
  errors?: any[]
  nextPowerup?: number
}
export async function freePowerup(accountName: string | Name, params?: any): Promise<FreePowerupResult> {
  if (typeof accountName == 'string') accountName = Name.from(accountName)
  const recentPowerups = await db.dopowerup.findMany({
    where: { receiver: accountName.toString(), payer: env.contractAccount.toString(), time: { gte: Date.now() - ms('24hr') }, failed: { not: true } },
    orderBy: { time: 'desc' },
  })
  console.log('recent Powerups', recentPowerups.length);
  if (recentPowerups.length < freeDailyQuota) {
    const result = await doPowerup(env.contractAccount, accountName, 3, 20)
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
          time: Date.parse(result.receipts[0].receipt.block_time.toString() + 'z'),
          txid: result.receipts[0].receipt.id.toString(),
          failed: false,
          reversible: true,
        }
      })
      return { status: 'success', powerupLog: logPowerUpData, txid: result.receipts[0].receipt.id, recentPowerups }
    }
    return { status: 'error', errors: result.errors }
  } else {
    // console.log('found recent powerups');
    const oldest = recentPowerups[recentPowerups.length - 1]
    // console.log(oldest);
    const elapsed = Date.now() - oldest.time
    // console.log('elapsed', elapsed);
    const timeLeft = ms('24h') - elapsed
    const nextPowerup = Date.now() + timeLeft
    // console.log('msleft:', timeLeft);
    return { status: 'reachedFreeQuota', nextPowerup, recentPowerups }
  }
}


export async function getStats() {
  const stats = await db.stats.findFirst({
    take: 1, orderBy: { createdAt: 'desc' }
  })
  return stats
}

// export async function
