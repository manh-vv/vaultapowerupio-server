import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import db from '../lib/db'
import { Logpowerup } from '@prisma/client'

async function init() {
  try {
    const sqlite = await open({
      filename: '../prisma/dev.db',
      driver: sqlite3.Database
    })
    const rows: Logpowerup[] = await sqlite.all(`
    SELECT *
    FROM Logpowerup
    `)
    console.log(rows.length);
    console.log(rows[0].txid);
    // const result = await db.logpowerup.createMany({ data: rows, skipDuplicates: true })
    // console.log(result);
    let i = 0
    for (let row of rows) {
      i++
      const result = await db.logpowerup.upsert({ where: { seq: row.seq }, create: row, update: {} })
      console.log(result);
      console.log(i);
    }
  } catch (error) {
    console.error(error)
  }
}
async function init2() {
  try {
    const sqlite = await open({
      filename: '../prisma/1dev.db',
      driver: sqlite3.Database
    })
    const rows: Logpowerup[] = await sqlite.all(`
    SELECT *
    FROM Logpowerup
    `)
    console.log(rows.length);
    console.log(rows[0].txid);
    // const result = await db.logpowerup.createMany({ data: rows, skipDuplicates: true })
    // console.log(result);
    let i = 0
    for (let row of rows) {
      i++
      const result = await db.logpowerup.upsert({ where: { seq: row.seq }, create: row, update: {} })
      console.log(result);
      console.log(i);
    }
  } catch (error) {
    console.error(error)
  }
}

init()
// init2()


let allTables = `
SELECT
  name
FROM
  sqlite_schema
WHERE
  type ='table' AND
  name NOT LIKE 'sqlite_%';
`
