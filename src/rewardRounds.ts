import env from './lib/env'
import { getAccount, doAction, getFullTable, getResouceCosts, ResourceCosts, getAllScopes } from './lib/eosio'
import ms from 'ms'
import { shuffle } from './lib/utils'
import { Config, Claim, Claimed, Rewardround, Rounds } from './lib/types/nftTypes'

let contract = 'pwrupnfts'
if (env.chain == 'eos') contract = 'powerup.nfts'
console.log('using contract:', contract);

async function getRound(): Promise<number> {
  const configTbl = await getFullTable({ tableName: 'config', contract, type: Config }).catch(err => console.error(err))
  const conf: Config = configTbl[0]
  const startTime = Date.parse(conf.start_time.toDate().toString()) / 1000
  const now = (Date.now() / 1000)
  const elapsed = now - startTime
  const round = Math.floor(elapsed / conf.round_length_sec.toNumber()) + 1
  console.log("current Round: ", round);
  return round
}

async function claimAll() {
  const allClaimed: Claimed[] = await getFullTable({ tableName: 'claimed', contract, type: Claimed })
  const unclaimed = allClaimed.filter(el => el.bronze_unclaimed.toNumber() > 0)
  console.log('found', unclaimed.length, 'unclaimed');
  for (const row of unclaimed) {
    console.log('claiming for', row.account.toString());
    let data = Claim.from({ donator: row.account })
    const result = await doAction('claim', data, contract).catch(console.error)
    if (!result) console.error('claim erorr', row)
    else {
      if (result.receipts.length == 0) console.error('claim erorr:', result.errors)
      else {
        console.log(result.receipts[0].url.toString())
        console.log(result.receipts[0].receipt.id)
      }
    }
  }
}

async function init() {
  try {
    const rounds: Rounds[] = await getFullTable({ tableName: 'rounds', contract: 'powerup.nfts', type: Rounds })
    const currentRound = await getRound()
    const unrewarded = rounds.filter(el => el.rewarded == false && el.id.toNumber() != currentRound)
    console.log('found', unrewarded.length, 'unrewarded rounds');
    for (const round of unrewarded) {
      const data = Rewardround.from({ round_id: round.id })
      const result = await doAction('rewardround', data, contract).catch(console.error)
      if (!result) console.error('rewardround erorr', round)
      else {
        if (result.receipts.length == 0) console.error('rewardround erorr:', result.errors)
        else {
          console.log(result.receipts[0].url.toString())
          console.log(result.receipts[0].receipt.id)
        }
      }
    }
    await claimAll()

  } catch (error) {
    console.error('top level error:', error)
    process.exit()
  }
}

init()
setInterval(init, ms('1hr'))
