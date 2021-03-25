const { JsonRpc, Api } = require('eosjs')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig')
const { TextDecoder, TextEncoder } = require('util')
const env = require('./.env')
// const random = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)

const tapos = {
  blocksBehind: 6,
  expireSeconds: 10,
  broadcast: true
}
function init(keys, apiurl) {
  if (!keys) keys = env.keys
  const signatureProvider = new JsSignatureProvider(keys)
  const fetch = require('node-fetch')
  if (!apiurl) apiurl = 'http://localhost:3051'
  var rpc = new JsonRpc(apiurl, { fetch })
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
  return { api, rpc,tapos }
}

module.exports = init 