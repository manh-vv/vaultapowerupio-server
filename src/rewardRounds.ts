import env from './lib/env'
import { getAccount, doAction, getFullTable, getResouceCosts, ResourceCosts, getAllScopes } from './lib/eosio'
import ms from 'ms'
import { shuffle } from './lib/utils'
import { Claim, Claimed, Rewardround, Rounds } from './lib/types/nftTypes'
let contract = 'pwrupnfts'
if (env.chain == 'eos') contract = 'powerup.nfts'
console.log('using contract:', contract);

async function claimAll() {
  const allClaimed: Claimed[] = await getFullTable({ tableName: 'claimed', contract, type: Claimed })
  const unclaimed = allClaimed.filter(el => el.bronze_unclaimed.toNumber() > 0)
  for (const row of unclaimed) {
    let data = Claim.from({ donator: row.account })
    await doAction('claim', data, contract)
  }
}

async function init() {
  try {
    const rounds: Rounds[] = await getFullTable({ tableName: 'rounds', contract: 'powerup.nfts', type: Rounds })
    const unrewarded = rounds.filter(el => el.rewarded == false)
    for (const round of unrewarded) {
      const data = Rewardround.from({ round_id: round.id })
      await doAction('rewardround', data, contract)
    }
    await claimAll()

  } catch (error) {
    console.error('top level error:', error)
  }
}

init()
