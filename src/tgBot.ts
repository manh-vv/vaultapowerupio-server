import { Name } from '@greymass/eosio'
import { accountExists, sleep } from './lib/utils'
import { Telegraf, Markup, Context } from 'telegraf'
import { readFileSync } from 'fs-extra'
import db from './lib/db'
import env from './lib/env'
const token = env.telegramKey

import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo("en-US")

const freeDailyQuota = 7

if (token === undefined) {
  throw new Error('telegramKey Missing!')
}
import { freePowerup, FreePowerupResult } from './lib/serverActions'
import ms from 'ms'

const bot = new Telegraf(token)

export default async function init(...inputs: any) {
  try {
    bot.use(Telegraf.log())

    bot.command('start', async (ctx: Context) => {
      registerUser(ctx)
      await ctx.replyWithPhoto({ source: readFileSync('../images/powerupBanner.jpg') }, { caption: "Welcome to eospowerup.io Bot, powered by Boid and Eden on EOS." })
      await showMainMenu(ctx)
    }).catch(err => console.error(err.toString()))
    bot.command('test', async (ctx: Context) => {
      registerUser(ctx)
    }).catch(err => console.error(err.toString()))

    bot.hears('Free PowerUp', async (ctx) => {
      await registerUser(ctx)
      const tgQuota = await checktgQuota(ctx.message.from.id)
      if (tgQuota.error) {
        await ctx.reply(tgQuota.error)
        await showMainMenu(ctx)
      } else if (tgQuota.nextPowerup) {
        await ctx.replyWithHTML(`
        <strong>Free PowerUp Error:</strong>
        ❌ Free PowerUp Quota reached for this account.
        ⏲️ Next free PowerUp available:
        ${timeAgo.format(new Date(tgQuota.nextPowerup))}
        `)
        return showMainMenu(ctx)
      } else {
        await ctx.reply(`You have ${tgQuota.quotaAvailable} of ${freeDailyQuota} free PowerUps available today.`)
      }
      await ctx.reply('Enter the name of the EOS account to PowerUp')
      bot.hears(RegExp('[\s\S]*'), async ctx => {
        await triggerPowerUp(ctx, env.contractAccount.toString(), ctx.message.text)
        await showMainMenu(ctx)
      })
    }).catch(err => console.error(err.toString()))

    bot.launch()
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
  } catch (error) {
    console.error(error.toString())
  }
}
interface TgQuotaResult { nextPowerup?: number, quotaAvailable: number, error?: string }
async function checktgQuota(tgid): Promise<TgQuotaResult> {
  try {
    const recentPowerups = await db.dopowerup.findMany({
      where: { User: { telegramId: tgid }, payer: env.contractAccount.toString(), time: { gte: Date.now() - ms('24hr') }, failed: { not: true } },
      orderBy: { time: 'desc' },
    })
    if (recentPowerups.length >= freeDailyQuota) {
      console.log('found recent tg User powerups');
      const oldest = recentPowerups[recentPowerups.length - 1]
      console.log(oldest);
      const elapsed = Date.now() - oldest.time
      console.log('elapsed', elapsed);
      const timeLeft = ms('24h') - elapsed
      const nextPowerup = Date.now() + timeLeft
      console.log('msleft:', timeLeft);
      return { nextPowerup, quotaAvailable: 0 }
    } else return { quotaAvailable: freeDailyQuota - recentPowerups.length }
  } catch (error) {
    console.error('checkQuota Error:', error.toString())
    return { error: "account error", quotaAvailable: 0 }
  }
}

async function registerUser(ctx: Context) {
  try {
    'Checking User Registration...'
    console.log(ctx.message.from.id);
    const from = ctx.message.from
    const result = await db.user.upsert({
      where: { telegramId: from.id },
      create: { telegramHandle: from.username, telegramId: from.id },
      update: {}
    })
    console.log('User Registered', result);

  } catch (error) {
    console.log(error.toString())
    ctx.reply('Error: ' + error.toString())
  }
}

async function showMainMenu(ctx: Context) {
  await ctx.reply('Choose an action below...', Markup.keyboard(['Free PowerUp']).resize().oneTime())
}

async function triggerPowerUp(ctx: Context, payer: string, name: string) {
  const statusMsg = await ctx.reply('Validating Account...')
  name = name.trim().toLowerCase()
  const valid = await accountExists(name)
  if (!valid) return bot.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, name + ' is not a valid EOS Account')

  console.log(valid);
  let dots: string[] = []
  let powerupResult: FreePowerupResult
  if (payer == env.contractAccount.toString()) {
    freePowerup(name).then(el => {
      powerupResult = el
    }).catch(error => {
      powerupResult = error
    })
  }
  while (!powerupResult) {
    await sleep(500)
    dots.push('⚡')
    await bot.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, 'Powering Up' + dots.join(''))
    if (dots.length == 5) dots = []
  }
  await bot.telegram.deleteMessage(ctx.chat.id, statusMsg.message_id).catch(err => console.error(err.toString()))
  if (!powerupResult.status || powerupResult.status == 'error') {
    ctx.replyWithHTML(`
    <strong>${name} Free PowerUp Error:</strong>
    ❌ ${JSON.stringify(powerupResult.errors)}
  `)
  }
  else if (powerupResult.status == 'success') {
    await db.dopowerup.update({ where: { txid: powerupResult.txid }, data: { User: { connect: { telegramId: ctx.message.from.id } } } })
    await ctx.replyWithHTML(`
    <strong>${name} received</strong>
    ⚡ CPU ${powerupResult.powerupLog.received_cpu_ms.value.toFixed(0)} ms
    ⛓️ NET ${powerupResult.powerupLog.received_net_kb.value.toFixed(0)} kb
    🔗 <a href="https://bloks.io/transaction/${powerupResult.txid}">txid</a>
  `)
  } else if (powerupResult.status == 'reachedFreeQuota') {
    bot.telegram.deleteMessage(ctx.chat.id, statusMsg.message_id).catch(err => console.error(err.toString()))
    await ctx.replyWithHTML(`
    <strong>${name} Free Quota Reached</strong>
    ⏲️ Next free PowerUp available:
    ${new Date(powerupResult.nextPowerup).toUTCString()}
  `)
  } else {
    await ctx.reply(JSON.stringify(powerupResult))
  }
}

if (require.main === module) {
  console.log('Starting Telegram Bot');
  init(...process.argv).catch(console.error)
    .then((result) => console.log('Finished'))
}
// init()

    // bot.command('simple', (ctx) => {
    //   return ctx.replyWithHTML(
    //     '<b>Coke</b> or <i>Pepsi?</i>',
    //     Markup.keyboard(['Coke', 'Pepsi'])
    //   )
    // })

    // bot.command('inline', (ctx) => {
    //   return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', {
    //     parse_mode: 'HTML',
    //     ...Markup.inlineKeyboard([
    //       Markup.button.callback('Coke', 'Coke'),
    //       Markup.button.callback('Pepsi', 'Pepsi')
    //     ])
    //   })
    // })

    // bot.command('random', (ctx) => {
    //   return ctx.reply(
    //     'random example',
    //     Markup.inlineKeyboard([
    //       Markup.button.callback('Coke', 'Coke'),
    //       Markup.button.callback('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
    //       Markup.button.callback('Pepsi', 'Pepsi')
    //     ])
    //   )
    // })

    // bot.command('caption', (ctx) => {
    //   return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
    //     {
    //       caption: 'Caption',
    //       parse_mode: 'Markdown',
    //       ...Markup.inlineKeyboard([
    //         Markup.button.callback('Plain', 'plain'),
    //         Markup.button.callback('Italic', 'italic')
    //       ])
    //     }
    //   )
    // })

    // bot.hears(/\/wrap (\d+)/, (ctx) => {
    //   return ctx.reply(
    //     'Keyboard wrap',
    //     Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
    //       columns: parseInt(ctx.match[1])
    //     })
    //   )
    // })

    // bot.action('Dr Pepper', (ctx, next) => {
    //   return ctx.reply('👍').then(() => next())
    // })

    // bot.action('plain', async (ctx) => {
    //   await ctx.answerCbQuery()
    //   await ctx.editMessageCaption('Caption', Markup.inlineKeyboard([
    //     Markup.button.callback('Plain', 'plain'),
    //     Markup.button.callback('Italic', 'italic')
    //   ]))
    // })

    // bot.action('italic', async (ctx) => {
    //   await ctx.answerCbQuery()
    //   await ctx.editMessageCaption('_Caption_', {
    //     parse_mode: 'Markdown',
    //     ...Markup.inlineKeyboard([
    //       Markup.button.callback('Plain', 'plain'),
    //       Markup.button.callback('* Italic *', 'italic')
    //     ])
    //   })
    // })

    // bot.action(/.+/, (ctx) => {
    //   return ctx.answerCbQuery(`Oh, ${ ctx.match[0] } !Great choice`)
    // })
