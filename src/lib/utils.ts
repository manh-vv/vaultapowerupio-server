import { Name } from "@wharfkit/antelope"
import chalk from "chalk"
import db from "./db"
import env from "./env"
import ms from "ms"


// import envImport from './env'
import { safeDo, getAccount } from "./eosio"
export const freeDailyQuota = 4
export const sleep = async(ms:number) => new Promise((resolve) => setTimeout(resolve, ms))

// export const env = { ...envImport }
export async function cronRunner(jobs:Function[], cutoff:number) {
  const runner = async() => {
    for (const job of jobs) {
      try {
        console.log("Starting:", chalk.green.bold.inverse(job.name))

        await job()
      } catch (error) {
        console.error("cronRunner Error:", error.toString())
      }
    }
  }
  const killSwitch = () => new Promise((res, reject) => setTimeout(() => reject(new Error("Timeout!!!!")), cutoff))
  await Promise.race([runner(), killSwitch()])
  process.exit()
}

export function shuffle<T>(array:T[]) {
  let currentIndex = array.length; let temporaryValue; let randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

export async function accountExists(name:string) {
  const validRegex = /(^[a-z1-5.]{0,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/
  if (typeof name !== "string") return false
  if (!validRegex.test(name)) return false
  try {
    const result = await getAccount(Name.from(name))
    // console.log('accountExists:', result);
    if (result) return true
    else return false
  } catch (error) {
    console.log("can't find account", error.toString())
    return false
  }
}

interface QuotaResult { nextPowerup?:number, quotaAvailable:number, error?:string }
export async function checkQuota(userid:string):Promise<QuotaResult> {
  try {
    const recentPowerups = await db.dopowerup.findMany({
      where: { User: { id: userid }, payer: env.contractAccount.toString(), time: { gte: Date.now() - ms("24hr") }, failed: { not: true } },
      orderBy: { time: "desc" }
    })
    if (recentPowerups.length >= freeDailyQuota) {
      console.log("found recent tg User powerups")
      const oldest = recentPowerups[recentPowerups.length - 1]
      console.log(oldest)
      // const elapsed = Date.now() - parseInt(oldest.time.toString())
      const elapsed = parseInt((BigInt(Date.now()) - oldest.time).toString())
      console.log("elapsed", elapsed)
      const timeLeft = ms("24h") - elapsed
      const nextPowerup = Date.now() + timeLeft
      console.log("msleft:", timeLeft)
      return { nextPowerup, quotaAvailable: 0 }
    } else return { quotaAvailable: freeDailyQuota - recentPowerups.length }
  } catch (error) {
    console.error("checkQuota Error:", error.toString())
    return { error: "account error", quotaAvailable: 0 }
  }
}
