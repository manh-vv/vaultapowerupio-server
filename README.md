# eospowerup.io server
All background tasks for operating eospowerup.io


## Prerequisites
* Nodejs
* yarn
* pm2

```bash
npm i -g yarn pm2
```

## Setup

Copy the config files and initialize the prisma DB

```bash
cp ./example.ecosystem.config.js ./ecosystem.config.js
cp ./example.env.json ./.env.json
npx prisma db push
yarn
```

If you just want to run a worker, you only need to run pwrBot. You can comment out all other jobs from the ecosystem file.

```bash
pm2 start ./ecosystem.config.js
```
