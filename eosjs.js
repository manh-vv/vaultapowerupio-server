const { JsonRpc, Api } = require('eosjs')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig')
const { TextDecoder, TextEncoder } = require('util')
const env = require('./.env')
const random = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
const fetch = require('node-fetch')
const customFetch = (url, options, timeout = 1450) => {
  return Promise.race([
    fetch(url, options),
    new Promise((resolve, reject) => setTimeout(() => reject(new Error("timeout")), timeout)),
  ])
}
const { Resources } = require('@greymass/eosio-resources')
const contractAccount = env.contractAccount
let api
const tapos = {
  blocksBehind: 3,
  expireSeconds: 15,
  broadcast: true
}
async function doAction(name, data, account, actor, permission, retry) {
  try {
    if (!retry) retry = 0
    if (!data) data = {}
    if (!account) account = contractAccount
    if (!actor) actor = 'eospowerupio'
    if (!permission) permission = 'workers'
    console.log("Do Action:", name, data)
    const authorization = [{ actor: env.workerAccount, permission: env.workerPermission }, { actor: 'eospowerupio', permission: 'workers' }]
    const { api } = init()

    const signed = await api.transact({
      // "delay_sec": 0,
      actions: [{ account, name, data, authorization }]
    }, {
      blocksBehind: 6,
      expireSeconds: 15,
      broadcast: false
    }).catch(err => {
      console.error('doAction transact error', err.toString())
    })
    if (!signed) return
    let results = []
    const endpoints = [...new Set(env.endpoints)]
    endpoints.forEach((endpoint,i,arr) => {
      {
        console.log('Pushing TX:', endpoint);
        const { api } = init(null,endpoint,true)
        api.pushSignedTransaction(signed)
          .then(el => {
            var txid = el.transaction_id
            console.log('Pushed Transaction:', txid);
            results.push({ endpoint, txid: txid })
          }).catch(err => {
            console.error('pushedSignedError:', endpoint, err.toString());
            results.push({ endpoint, error: err.toString() })
          }).finally(data => {
            // console.log();
            if(i == arr.length - 1) console.log('DoAction Finished Results:', results);
          })
      }
    })
    // const txid = result.transaction_id
    // console.log(`https://bloks.io/transaction/` + txid)
    // console.log(txid)
    return results
  } catch (error) {
    console.error('DoAction Error:', error.toString())
    throw (error)
  }
}

function pickEndpoint(endpoints) {
  return endpoints[random(0, endpoints.length - 1)]
}

function init(keys, apiurl,noQuickTimeout) {
  if (!keys) keys = env.keys
  const signatureProvider = new JsSignatureProvider(keys)
  if (!apiurl) apiurl = pickEndpoint(env.endpoints)
  console.log('API:', apiurl)
  var resources
  var rpc

  if(!noQuickTimeout) {
     resources = new Resources({ fetch:customFetch, url: apiurl })
     rpc = new JsonRpc(apiurl, {  fetch:customFetch })
  } else {
     resources = new Resources({ fetch, url: apiurl })
     rpc = new JsonRpc(apiurl, {  fetch })
  }

  api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
  return { api, rpc, tapos, resources, doAction }
}

module.exports = init