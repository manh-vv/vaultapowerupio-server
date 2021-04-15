const powerup = require('../powerup')
const ax = require('axios')
const ms = require('ms')
const pwrAccount = 'eospowerupio'

let freePowerups = {}

function checkValid(accountName) {
  const now = Date.now()
  if (freePowerups[accountName]) {
    if ((now - freePowerups[accountName]) > ms('12h')) {
      freePowerups[accountName] = now
      return true
    }
    else return false
  } else {
    freePowerups[accountName] = now
    return true
  }
}

function cpuPowerupMs(ms) {
  return 29411000 * ms
}

function netPowerupKb(kb) {
  return 5500 * kb
}

module.exports = {
  async freePowerup(accountName){
    if (checkValid(accountName)) {
      const {doAction} = require('../eosjs.js')()
      const data = {
        payer:"eospowerupio",
        receiver:accountName,
        net_frac:netPowerupKb(0.5),
        cpu_frac:cpuPowerupMs(3),
        max_payment:"0.0080 EOS"
      }
      const result = doAction('dopowerup',data,'eospowerupio','eospowerupio','powerup',null,[{ actor: 'eospowerupio', permission: 'powerup' }])

      return {result}
    }
    else return {error:"try again later"}
  },
  async registerEmail(email){
    const result = await ax.post('http://eospowerup-bb-dev.azurewebsites.net/userrecord/add',{Email:email})
    return {result}
  }
}