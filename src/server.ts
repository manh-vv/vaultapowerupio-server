import express from 'express'
const app = express()
import ms from 'ms'
import rateLimit from "express-rate-limit"
var cors = require('cors')
import * as serverActions from './lib/serverActions'
app.set('trust proxy', 1);
import * as basicAuth from 'express-basic-auth'
var proxy = require('express-http-proxy');


import ExpressCache from 'express-cache-middleware'
import cacheManager from 'cache-manager'

const limiter = rateLimit({
  windowMs: ms('12h'),
  max: 20
});

const limiter2 = rateLimit({
  windowMs: ms('30m'),
  max: 100
});

const cacheMiddleware = new ExpressCache(
  cacheManager.caching({
    max: 100,
    store: 'memory', ttl: 10
  })
)

const auth = basicAuth.default({
  users: {
    'powerupadmin': 'boidisthewoid',
  },
  challenge: true,
  realm: 'eospowerupio'
})


app.use(express.json())

app.use(cors())

app.use(async function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use('/freePowerup/:accountName', limiter, async (req, res) => {
  try {
    console.log('Powerup Request:', req?.params?.accountName, req.headers['x-forwarded-for'] || req.socket.remoteAddress);
    console.log(req.rateLimit);
    const name = String(req.params.accountName).trim().toLowerCase()
    const result = await serverActions.freePowerup(name, req.query)
    if (result?.status == 'error') {
      res.statusCode = 400
    }
    res.json({ result, rateLimit: req.rateLimit })
  } catch (error) {
    res.statusCode = 500
    console.log(error)
    res.json(error)
  }
})

app.use('/studio', auth, proxy('http://localhost:5555'))
cacheMiddleware.attach(app)
app.use('/stats', limiter2, async (req, res) => {
  try {
    const result = await serverActions.getStats()
    // if (result?.error) throw ("Error")
    res.json(result)
  } catch (error) {
    res.statusCode = 500
    console.log(error)
    res.json(error)
  }
})
app.listen(3000, () => console.log('Server is running on http://localhost:3000'))
