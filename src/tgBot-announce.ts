
import { accountExists, sleep, checkQuota, freeDailyQuota } from './lib/utils'
import { Telegraf, Markup, Context } from 'telegraf'
import env from './lib/env'
import db from './lib/db'
const token = env.telegramKey

if (token === undefined) {
  throw new Error('telegramKey Missing!')
}

const bot = new Telegraf(token)

export default async function init(...inputs: any) {
  try {
    let message: string = inputs[2]
    if (!message) throw ('must specify message')
    console.log('sending message:', message);
    bot.launch()
    const users = await db.user.findMany({ where: { telegramId: { not: null } } })
    console.log(users.length);

    for (let user of users) {
      console.log('sending:', user.telegramHandle, user.telegramId);
      const result = await bot.telegram.sendMessage(user.telegramId.toString(), message).catch(console.log)
    }
    bot.stop()

    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
  } catch (error) {
    console.error(error.toString())
  }
}


if (require.main === module) {
  console.log('Starting Telegram Bot');
  init(...process.argv).catch(console.error)
    .then((result) => {
      console.log('Finished')
      db.$disconnect()
    })
}


//PowerUp Bronze NFT staking is now live! You can stake your Bronze NFT to receive additional CPU when claiming free PowerUps. Visit https://eospowerup.io/nft/activate for details.
