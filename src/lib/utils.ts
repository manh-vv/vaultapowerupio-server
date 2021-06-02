import { Name } from '@greymass/eosio';
import chalk from 'chalk'
// import envImport from './env'
import { safeDo, getAccount } from './eosio';
export const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// export const env = { ...envImport }
export async function cronRunner(jobs: Function[], cutoff: number) {
  const runner = async () => {
    for (const job of jobs) {
      try {
        console.log('Starting:', chalk.green.bold.inverse(job.name));

        await job()
      } catch (error) {
        console.error('cronRunner Error:', error.toString());
      }
    }
  }
  const killSwitch = () => new Promise((res, reject) => setTimeout(() => reject(new Error("Timeout!!!!")), cutoff))
  await Promise.race([runner(), killSwitch()])
  process.exit()
}

export function shuffle<T>(array: T[]) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array
}

export async function accountExists(name: string) {
  const validRegex = new RegExp('(^[a-z1-5.]{0,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)')
  if (typeof name !== 'string') return false
  if (!validRegex.test(name)) return false
  try {
    const result = await getAccount(Name.from(name))
    // console.log('accountExists:', result);
    if (result) return true
    else return false
  } catch (error) {
    console.log("can't find account", error.toString());
    return false
  }


}