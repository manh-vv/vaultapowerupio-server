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

module.exports = {
  async freePowerup(accountName){
    if (checkValid(accountName)) {
      const result = await powerup(pwrAccount,0.5,accountName,'powerup','0.005')
      return {result}
    }
    else return {error:"try again later"}
  },
  async registerEmail(email){
    const result = await ax.post('http://eospowerup-bb-dev.azurewebsites.net/userrecord/add',{Email:email})
    return {result}
  }
}