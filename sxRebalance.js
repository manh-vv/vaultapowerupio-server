const {doAction} = require('./eosjs')()
const ms = require('ms')

async function init(){
  try {
    console.log('sxrebalance...');
    await doAction('sxrebalance',{maintain_bal:"200.0000 EOS"},'eospowerupio',null,null,null,[{ actor: 'eospowerupio', permission: 'powerup' }])
  } catch (error) {
    console.error(error)
  }
}

init()
setInterval(init,ms('10m'))
