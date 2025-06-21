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

# Setup permission

```log
eosio::powerup
eospowerupio::dopowerup
eospowerupio::dobuyram
eospowerupio::sxrebalance
eospowerupio::withdraw
powerup.nfts::*
```

```sh
cleos -u https://jungle4.genereos.io set action permission vaultapwerup eosio powerup powerup
cleos -u https://jungle4.genereos.io set action permission vaultapwerup core.vaulta powerup powerup


cleos -u https://jungle4.genereos.io set action permission vaultapwerup vaultapwerup dobuyram powerup
cleos -u https://jungle4.genereos.io set action permission vaultapwerup vaultapwerup sxrebalance powerup
cleos -u https://jungle4.genereos.io set action permission vaultapwerup vaultapwerup withdraw powerup

cleos -u https://jungle4.genereos.io set action permission powerup.nfts powerup.nfts * powerup

cleos -u https://jungle4.genereos.io set action permission vaultapwerup vaultapwerup autopowerup workers
cleos -u https://jungle4.genereos.io set action permission vaultapwerup vaultapwerup autobuyram workers
cleos -u https://jungle4.genereos.io set action permission vaultapwerup vaultapwerup dopowerup workers
```