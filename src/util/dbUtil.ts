import db from "../lib/db"
async function init() {
  try {
    // const oldPowerUps = await db.dopowerup.deleteMany()
    // console.log('Removed oldPowerUps', oldPowerUps.count)
    // const rpcErrors = await db.rpcErrors.deleteMany()
    // console.log('Removed rpcErrors', rpcErrors)
    // const oldPowerUps = await db.logpowerup.deleteMany()
    // console.log('Removed logpowerup', oldPowerUps.count)
    // const rpcErrors = await db.logbuyram.deleteMany()
    // console.log('Removed logbuyram', rpcErrors)
    const oldPowerUps = await db.transfer.deleteMany()
    console.log("Removed transfer", oldPowerUps.count)
    const rpcErrors = await db.stats.deleteMany()
    console.log("Removed stats", rpcErrors)
  } catch (error) {
    console.log(error.toString())
  }
}
init().finally(db.$disconnect)

