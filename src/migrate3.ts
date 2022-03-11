import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import db from './lib/db'
import { blacklist, Logbuyram, Logpowerup } from '@prisma/client'

async function init() {
  try {
    const sqlite = await open({
      filename: '../prisma/dev.db',
      driver: sqlite3.Database
    })
    const rows: blacklist[] = await sqlite.all(`
    SELECT *
    FROM blacklist
    `)
    console.log(rows.length);
    // return
    // console.log(rows[0].txid);
    // const result = await db.logpowerup.createMany({ data: rows, skipDuplicates: true })
    // console.log(result);
    let i = 0
    for (let row of rows) {
      i++
      const result = await db.blacklist.upsert({ where: { account: row.account }, create: row, update: {} })
      console.log(result);
      console.log(i);
    }
  } catch (error) {
    console.error(error)
  }
}

init().then(db.$disconnect)


let allTables = `
SELECT
  name
FROM
  sqlite_schema
WHERE
  type ='table' AND
  name NOT LIKE 'sqlite_%';
`
