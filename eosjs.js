const { JsonRpc, Api } = require('eosjs')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig')
const { TextDecoder, TextEncoder } = require('util')
const env = require('./.env')
const random = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
const fetch = require('node-fetch')
const { Resources } = require('@greymass/eosio-resources')
const contractAccount = env.contractAccount
let api
const tapos = {
  blocksBehind: 6,
  expireSeconds: 10,
  broadcast: true
}
async function doAction(name, data, account, actor,permission) {
  try {
    if (!data) data = {}
    if (!account) account = contractAccount
    if (!actor) actor = 'eospowerupio'
    if (!permission) permission = 'workers'
    console.log("Do Action:", name, data)
    const authorization = [{actor:env.workerAccount,permission:env.workerPermission},{ actor, permission }]
    const result = await api.transact({
      // "delay_sec": 0,
      actions: [{ account, name, data, authorization }]
    }, tapos)
    const txid = result.transaction_id
    console.log(`https://bloks.io/transaction/` + txid)
    // console.log(txid)
    return result
  } catch (error) {
    console.error(error.toString())
    if (error.json) console.error("Logs:", error.json?.error?.details[1]?.message)
  }
}

function pickEndpoint(endpoints){
  return endpoints[random(0,endpoints.length - 1)]
}

function init(keys, apiurl) {
  if (!keys) keys = env.keys
  const signatureProvider = new JsSignatureProvider(keys)
  if (!apiurl) apiurl = pickEndpoint(env.endpoints)
  console.log('API:',apiurl)
  const resources = new Resources({ fetch, url:apiurl})
  var rpc = new JsonRpc(apiurl, { fetch })
  api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
  return { api, rpc,tapos,resources,doAction }
}

module.exports = init 