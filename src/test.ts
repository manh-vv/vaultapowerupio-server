import { Name } from "@wharfkit/antelope"
import * as serverActions from "./lib/serverActions"
import { log } from "console"
import { AccountRow } from "lib/types/eospowerupio.types"

export function toObject(data) {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === "bigint"
      ? value.toString()
      : value // return everything else unchanged
  ))
}

async function init() {
  try {
    const acct = Name.from("boorad.test")
    const row = AccountRow.from({ balance: "22.2000 TLOS" })
    log(toObject(row))
  } catch (error) {
    console.error(error)
  }
}
init()
