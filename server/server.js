const express = require('express')
const app = express()
var proxy = require('express-http-proxy')
const ms = require('ms')
const bodyParser = require('body-parser')
const rateLimit = require("express-rate-limit")
const slowDown = require('express-slow-down')
var cors = require('cors')
const serverActions = require('./serverActions')
app.set('trust proxy', 1);

const speedLimiter = slowDown({
  windowMs: ms('60m'),
  delayAfter: 10,
  delayMs: 1000
})
const limiter = rateLimit({
  windowMs: ms('30m'),
  max: 10 
});

app.use(speedLimiter)
app.use(limiter)
app.use(bodyParser.json())

app.use(cors())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use('/freePowerup/:accountName', async (req, res) => {
  try {
    const name = String(req.params.accountName).trim().toLowerCase()
    const result = await serverActions.freePowerup(name, req.query)
    if (result.error) res.statusCode = 500
    res.json(result)
  } catch (error) {
    res.statusCode = 500
    console.log(error)
    res.json(error)
  }
})

app.post('/registerEmail/:email',async (req,res) => {
  try {
    const result = await serverActions.registerEmail(req.params.email, req.query)
    if (result.error) res.statusCode = 500
    res.end()
  } catch (error) {
    res.statusCode = 500
    console.log(error)
    res.json(error)
  }
})



// app.use('/db',proxy('http://localhost:8091'))
app.listen(3000, () => console.log('Server is running on http://localhost:3000'))
