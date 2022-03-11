import db from './lib/db'
import fs from 'fs-extra'
import { User } from '@prisma/client'
async function write() {
  try {
    // const users: User[] = await fs.readJSON('../users.json')
    // for (let user of users) {
    //   await db.user.create({ data: user })
    //   console.log(user.id);
    // }

    const users = await db.user.findMany()
    console.log(users.length);

    // // await fs.writeJSON('../users.json', users)
  } catch (error) {
    console.error(error)
  }
}

write().finally(() => db.$disconnect())
