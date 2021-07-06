import Discord from "discord.js"
import db from "./lib/db";
import { title } from "process";
const { Menu } = require('discord.js-menu')
import env from "./lib/env"
import { accountExists, checkQuota, freeDailyQuota, sleep } from "./lib/utils";
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import { freePowerup, FreePowerupResult } from "./lib/serverActions";
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo("en-US")

async function init() {
  try {
    const client = new Discord.Client()
    client.on("message", async function (message) {
      let args = message.content.split(' ')
      try {
        if (message.author.bot) return;
        if (message.channel.type == "dm") {
          if (args[0] == '<@!859243915054678067>') args = args.splice(1, 5)
        } else if ((message.channel.type == "text") && message?.mentions?.members?.every(el => el.user.id == client.user.id)) {
          if (args[0] != '<@!859243915054678067>') return
          args = message.content.split(' ').splice(1, 5)
        } else return

        const cmd = args[0]?.toLowerCase()
        if (cmd == 'help') {
          await showHelpMsg(message)
        } else if (cmd == 'powerup') {
          const userid = await registerUser(message.author)
          const quota = await checkQuota(userid)
          if (quota.error) {
            await message.channel.send(quota.error)
          } else if (quota.nextPowerup) {
            const errorMsg = new Discord.MessageEmbed()
              .addField("Free PowerUp Error:", [
                `❌ Free PowerUp Quota reached for ${message.author.username.toString()}.`,
                '⏲️ Next free PowerUp available:',
                timeAgo.format(new Date(quota.nextPowerup))
              ])
            message.channel.send(errorMsg)
          } else {
            await message.reply(`You have ${quota.quotaAvailable} of ${freeDailyQuota} free PowerUps available today.`)
            await triggerPowerUp(message, env.contractAccount.toString(), args[1])
          }
        } else if (message.channel.type == "dm") await showHelpMsg(message)
      } catch (error) {
        console.error(error)
      }
    });
    await client.login(env.discordKey)

  } catch (error) {
    console.error(error)
  }
}
async function showHelpMsg(message: Discord.Message) {
  let helpMsg = new Discord.MessageEmbed()
  if (message.channel.type == "dm") {
    helpMsg
      .setImage("https://eospowerup.io/eospowerupio.jpg")
      .setDescription("Welcome to the https://eospowerup.io Bot, powered by Boid and Eden on EOS.")
      .addField('Command Examples:', ['powerup myeosaccount'], false)
      .addField('Also works in public channels', 'To issue commands to me in a server just use @eospowerupio prefix before each command')
      .addField("Add me to your server", "https://discord.com/api/oauth2/authorize?client_id=859243915054678067&permissions=2148006976&scope=bot")
  } else if (message.channel.type == "text") {
    helpMsg
      .setImage("https://eospowerup.io/eospowerupio.jpg")
      .setDescription("Welcome to eospowerup.io Bot, powered by Boid and Eden on EOS.")
      .addField('Command Examples:', ['@eospowerupio powerup myeosaccount'], false)
      .addField('Also you can DM me commands', 'When you DM me, you don\'t have to use the @eospowerupio prefix.')
  }
  await message.channel.send(helpMsg)
}

async function registerUser(user: Discord.User): Promise<string> {
  console.log('Ensure User Registered:', user.id);
  console.log(user.discriminator);

  const result = await db.user.upsert({
    where: { discordId: user.id },
    create: { discordId: user.id, discordHandle: user.username.toString() },
    update: {}
  })
  console.log(result)
  return result.id
}

async function triggerPowerUp(message: Discord.Message, payer: string, name: string) {
  const statusMsg = await message.reply('Validating Account...')
  name = name.trim().toLowerCase()
  const valid = await accountExists(name)
  if (!valid) return await statusMsg.edit(name + ' is not a valid EOS Account')
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
    await statusMsg.edit('Powering Up' + dots.join(''))
    if (dots.length == 5) dots = []
  }
  await statusMsg.delete()
  const response = new Discord.MessageEmbed()
  if (!powerupResult.status || powerupResult.status == 'error') {
    message.reply(response.addField("Free PowerUp Error:", `❌ ${JSON.stringify(powerupResult.errors, null, 2)}`))
  }
  else if (powerupResult.status == 'success') {
    await db.dopowerup.update({ where: { txid: powerupResult.txid }, data: { User: { connect: { discordId: message.author.id } } } })
    await message.reply(response.addField(`${name} received PowerUp.`, [
      `⚡ CPU ${powerupResult.powerupLog.received_cpu_ms.value.toFixed(0)} ms`,
      `⛓️ NET ${powerupResult.powerupLog.received_net_kb.value.toFixed(0)} kb`,
      `🔗 [txid](https://bloks.io/transaction/${powerupResult.txid})`
    ]))
  } else if (powerupResult.status == 'reachedFreeQuota') {
    await message.reply(response.addField(`${name} Free Quota Reached`, [
      `⏲️ Next free PowerUp available:`,
      `${new Date(powerupResult.nextPowerup).toUTCString()}`
    ]))
  } else {
    await message.reply(JSON.stringify(powerupResult, null, 2))
  }
}

init().catch(console.error)