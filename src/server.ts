import express from "express"
import ms from "ms"
import rateLimit from "express-rate-limit"
import * as serverActions from "./lib/serverActions"
import * as basicAuth from "express-basic-auth"
import checkTor from "istorexit"

import blacklist from "express-blacklist"

import ExpressCache from "express-cache-middleware"
import cacheManager from "cache-manager"
import { exit } from "process"
const app = express()
let cors = require("cors")
app.set("trust proxy", 1)
let proxy = require("express-http-proxy")
app.use(blacklist.blockRequests("../blacklist.txt"))
function toObject(data) {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === "bigint"
      ? parseInt(value.toString())
      : value // return everything else unchanged
  ))
}

const limiter = rateLimit({
  windowMs: ms("24h"),
  max: 4
})

const limiter2 = rateLimit({
  windowMs: ms("30m"),
  max: 10
})

const cacheMiddleware = new ExpressCache(
  cacheManager.caching({
    max: 100,
    store: "memory",
    ttl: 10
  })
)

const auth = basicAuth.default({
  users: {
    "powerupadmin": "boidisthewoid"
  },
  challenge: true,
  realm: "eospowerupio"
})

app.use(express.json())

app.use(cors())

let blocklist = []
let whitelist = []

app.use(async function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
  const exit = () => {
    console.log("Blocking request From:", ip)
    res.statusCode = 403
    res.end()
    return
  }
  if (whitelist.some(el => el == ip)) return next()
  else if (blocklist.some(el => el == ip)) return exit()
  else if (await checkTor(ip)) {
    console.log("Blocked Tor:", ip)
    blocklist.push(ip)
    console.log("blocklist length:", blocklist.length)
    return exit()
  } else {
    whitelist.push(ip)
    console.log("Whitelist length:", whitelist.length)
    next()
  }
})

app.use("/freePowerup/:accountName", limiter, async(req, res) => {
  try {
    console.log("Powerup Request:", req?.params?.accountName, req.headers["x-forwarded-for"] || req.socket.remoteAddress)
    console.log(req.rateLimit)
    const name = String(req.params.accountName).trim().toLowerCase()
    const result = await serverActions.freePowerup(name, req.query)
    if (result?.status == "error") {
      res.statusCode = 400
    }
    console.log(result)
    res.json({ result: toObject(result), rateLimit: req.rateLimit })
  } catch (error) {
    res.statusCode = 500
    console.log(error)
    res.json(error)
  }
})

app.use("/studio", auth, proxy("http://localhost:5555"))
cacheMiddleware.attach(app)
app.use("/stats", limiter2, async(req, res) => {
  try {
    const result = await serverActions.getStats()
    // if (result?.error) throw ("Error")
    res.json(toObject(result))
    // res.send(result)
  } catch (error) {
    res.statusCode = 500
    console.log(error)
    res.json(error)
  }
})
app.listen(3000, () => console.log("Server is running on http://localhost:3000"))
