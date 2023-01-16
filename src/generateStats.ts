import Mixpanel from "mixpanel"
import { getFullTable, getAllScopes, safeDo, pickRpc } from "./lib/eosio"
import env from "./lib/env"
import { Name } from "@greymass/eosio"
import { AccountRow, WatchlistRow } from "./lib/types/eospowerupio.types"
import db from "./lib/db"
import ms from "ms"
// initialize mixpanel client configured to communicate over https
let mixpanel = Mixpanel.init("9ff1909bddc4e74db9192b48f0149941", {
  protocol: "https"
})

let stats = {
  owners: 0,
  totalWatched: 0
}

async function updateStats(data?:any) {
  try {
    let totalWatched = 0
    let totalDeposited = 0
    let i = 0
    let i2 = 0
    const owners = await getAllScopes({ code: env.contractAccount, table: Name.from("account") })
    stats.owners = owners.length
    console.log("Owners", stats.owners)
    let getResults = []

    owners.forEach(async owner => {
      getResults.push(new Promise((res, rej) => {
        setTimeout(async() => {
          const result = await getFullTable({ tableName: Name.from("watchlist"), contract: env.contractAccount, scope: owner, type: WatchlistRow }) as WatchlistRow[]
          totalWatched += result.length
          res(null)
        }, 1410 * i)
        i++
      }))
      getResults.push(new Promise((res, rej) => {
        setTimeout(async() => {
          const result = await getFullTable({ tableName: Name.from("account"), contract: env.contractAccount, scope: owner, type: AccountRow })
          totalDeposited += parseFloat(result[0]?.balance) || 0
          res(null)
        }, 1000 * i2)
        i2++
      }))
    })
    await Promise.all(getResults)
    const errors = await db.rpcErrors.findMany({ where: { time: { gt: Date.now() - ms("2h") } } })

    const rpcErrorStats = {}
    for (const error of errors) {
      if (rpcErrorStats[error.endpoint]) rpcErrorStats[error.endpoint]++
      else rpcErrorStats[error.endpoint] = 1
    }

    const eosBal = parseFloat((await getFullTable({ contract: Name.from("eosio.token"), tableName: Name.from("accounts"), scope: env.contractAccount }))[0].balance)
    const internalEOSBal = parseFloat((await getFullTable({ contract: env.contractAccount, tableName: Name.from("account"), scope: env.contractAccount }))[0].balance)
    const registeredUsers = await db.user.aggregate({
      _count: { id: true }
    })
    const monthAgo = Date.now() - ms("4w")
    console.log("monthAgo", monthAgo)
    const activeTgUsers = await db.user.aggregate({
      where: { freePowerups: { some: { time: { gt: monthAgo } } }, AND: { telegramId: { not: null } } },
      _count: { _all: true }
    })
    const activeDiscordUsers = await db.user.aggregate({
      where: { freePowerups: { some: { time: { gt: monthAgo } } }, AND: { discordId: { not: null } } },
      _count: { _all: true }
    })
    console.log(activeTgUsers._count._all)
    const allFreePowerups = await db.logpowerup.aggregate({
      where: { payer: { equals: env.contractAccount.toString() }, blockTime: { gt: Date.now() - ms("1d") } },
      _count: { _all: true },
      _sum: { cost: true }
    })
    console.log(allFreePowerups)
    let freePowerups24hr = allFreePowerups._count._all
    let freePowerupsCost24hr = allFreePowerups._sum.cost || 0

    const recentPowerups = (await db.logpowerup.aggregate({
      where: { blockTime: { gt: Date.now() - ms("1d") }, AND: { payer: { not: env.contractAccount.toString() } } },
      _count: { _all: true },
      _sum: { fee: true, cost: true }

    }))

    const autopowerups24hr = recentPowerups._count._all || 0
    const autopowerupfees24hr = recentPowerups._sum.fee || 0
    const autopowerupCost24hr = recentPowerups._sum.cost || 0

    const autobuyram = (await db.logbuyram.aggregate({
      where: { blockTime: { gt: Date.now() - ms("1d") } },
      _count: { _all: true },
      _sum: { fee: true, cost: true }
    }))

    const autobuyram24hr = autobuyram._count._all || 0
    const autobuyramfees24hr = autobuyram._sum.fee || 0
    const autobuyramCost24hr = autobuyram._sum.cost || 0

    // console.log('recentAutoPowerups', recentPowerups);

    const extraStats = {
      autopowerupCost24hr,
      autobuyramCost24hr,
      autobuyram24hr,
      autobuyramfees24hr,
      autopowerups24hr,
      totalWatched,
      rpcErrorStats,
      registeredUsersTotal: registeredUsers._count.id,
      eosBal,
      internalEOSBal,
      totalDeposited,
      activeTgUsers: activeTgUsers._count._all,
      autopowerupfees24hr,
      freePowerups24hr,
      freePowerupsCost24hr,
      activeDiscordUsers: activeDiscordUsers._count._all
    }

    stats = Object.assign(stats, extraStats)

    console.log(stats)
    console.log("Send Data to mixpanel...")
    mixpanel.track("stats", Object.assign({}, stats))

    await db.stats.create({
      data: {
        owners: stats.owners,
        totalDeposited: extraStats.totalDeposited,
        totalWatched: extraStats.totalWatched,
        registeredUsersTotal: extraStats.registeredUsersTotal,
        internalEOSBal: extraStats.internalEOSBal,
        activeTgUsers: extraStats.activeTgUsers,
        eosBal: extraStats.eosBal,
        createdAt: Date.now(),
        autopowerups24hr: extraStats.autopowerups24hr,
        autopowerupfees24hr: extraStats.autopowerupfees24hr,
        autobuyram24hr,
        autobuyramfees24hr,
        autopowerupCost24hr,
        autobuyramCost24hr,
        freePowerups24hr,
        freePowerupsCost24hr,
        activeDiscordUsers: extraStats.activeDiscordUsers,
        rpcErrorStats: JSON.stringify(rpcErrorStats)
      }
    })
    return stats
  } catch (error) {
    console.error("Stats Error:", error)
  }
}

if (require.main === module) {
  console.log("Starting: stats")
  updateStats(...process.argv.slice(2)).catch(console.error)
  setInterval(updateStats, ms("1h"))
}

module.exports = { stats, updateStats }
