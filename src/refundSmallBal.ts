import { doAction, getAllScopes, getFullTable } from "./lib/eosio"
import ms from "ms"
import env from "./lib/env"
import { Name, PermissionLevel } from "@greymass/eosio"
import { Withdraw } from "./lib/types/eospowerupio.types"

function shuffle(array) {
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

async function init() {
  try {
    const result = await getAllScopes({ code: env.contractAccount.toString(), table: Name.from("account") })
    console.log("accounts:", result.length)
    console.log("Checking for small balances...")
    for (const account of shuffle(result)) {
      try {
        const balance = (await getFullTable({ contract: env.contractAccount, tableName: Name.from("account"), scope: account }))[0].balance
        console.log(balance)

        if (parseFloat(balance) < 0.035) {
          console.log(account, balance)
          const result = await doAction(Name.from("withdraw"), Withdraw.from({ owner: account, quantity: balance, receiver: account }), null, [PermissionLevel.from("eospowerupio@powerup")], [env.keys[1]])
          console.log(result)
        }
      } catch (error) {
        console.error(error)
      }
    }
  } catch (error) {
    console.error(error)
  }
}
init().catch(err => console.log(err.toString()))
setInterval(init, ms("1h"))
