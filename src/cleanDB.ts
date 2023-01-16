import { Sql } from "@prisma/client/runtime"
import ms from "ms"
import db from "./lib/db"
async function init() {
  try {
    const oldPowerUps = await db.dopowerup.deleteMany({ where: { time: { lt: Date.now() - ms("48h") } } })
    console.log("Removed oldPowerUps", oldPowerUps.count)
    const rpcErrors = await db.rpcErrors.deleteMany({ where: { time: { lt: Date.now() - ms("48h") } } })
    console.log("Removed rpcErrors", rpcErrors)
    //   const result = await db.$queryRaw(`

    // DELETE FROM rpcErrors;
    // FROM main
    // `)
    //   console.log(result);
  } catch (error) {
    console.log(error.toString())
  }
}
init()
setInterval(init, ms("60m"))

