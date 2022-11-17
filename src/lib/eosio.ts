import { API, APIClient, APIProvider, FetchProvider, Name, Action, Transaction, ActionFields, Authority, PermissionLevel, PermissionLevelType, SignedTransaction, PrivateKey, NameType, } from '@greymass/eosio'
import fetch from 'node-fetch'
import ms from 'ms'
import { shuffle } from './utils'
import env from './env'
import db from './db'

let client: APIClient
let provider: APIProvider
export let rpcs: { endpoint: URL, rpc: typeof client.v1.chain }[]
const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
function rand(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
import { Resources } from '@greymass/eosio-resources'

interface TransactionResponse {
  url: string
  receipt: {
    id: string;
    block_num: number;
    block_time: string;
    receipt: {
      status: string;
      cpu_usage_us: number;
      net_usage_words: number;
    };
    elapsed: number;
    net_usage: number;
    scheduled: boolean;
    action_traces: any[];
    account_ram_delta: any;
  }
}
export interface DoActionResponse {
  receipts: TransactionResponse[]
  errors: any[]
}

interface GetTableParams {
  tableName: NameType
  scope?: NameType
  contract?: NameType,
  type?: any
}

async function errorCounter(endpoint: string, error: string) {
  console.log('writing error:', endpoint, error);
  // await db.$connect()
  db.rpcErrors.create({ data: { endpoint, error, time: Date.now() } }).catch(console.error)
  // await db.$disconnect()
}
export interface ResourceCosts { cpuMsCost: number, netKbCost: number, msToFrac: number, kbToFrac: number }
export async function getResouceCosts(retry?: number): Promise<ResourceCosts | null> {
  if (!retry) retry = 0
  try {
    const doit = async () => {
      const url = pickRpc().endpoint.toString()
      try {
        let resources = new Resources({ fetch, url })
        const powerup = await resources.v1.powerup.get_state()
        const sample = await resources.getSampledUsage()
        const cpuMsCost = powerup.cpu.price_per_ms(sample, 1)
        const netKbCost = powerup.net.price_per_kb(sample, 1)
        const msToFrac = powerup.cpu.frac_by_ms(sample, 1)
        const kbToFrac = powerup.net.frac_by_kb(sample, 1)
        return { cpuMsCost, netKbCost, msToFrac, kbToFrac } as ResourceCosts
      } catch (error) {
        console.error('Resource Costs Error:', url, error.toString());
        errorCounter(url, error.toString())
        await sleep(ms('8s'))
        throw (error)
      }
    }
    const result = await Promise.race([
      doit(),
      new Promise((res, reject) => setTimeout(() => reject(new Error("getResouceData Timeout!!!!")), ms('3s')))
    ])
    if (result) return result as ResourceCosts
    else return null
  } catch (error) {
    console.error('DoRequest Error:', error.toString())
    console.error("RETRY", retry);
    retry++
    if (retry < 5) return getResouceCosts(retry)
  }
}


export async function safeDo(cb: string, params?: any, retry?: number): Promise<any | null> {
  if (!retry) retry = 0
  const rpc = pickRpc()
  const url = rpc.endpoint.toString()
  console.log('Try rpc:', url);

  try {
    const doit = async () => {

      try {
        const result = (await rpc.rpc[cb](params))
        return result
      } catch (error) {
        const errorMsg = error.toString() as string
        console.error('safeDo Error:', rpc.endpoint.toString(), errorMsg, error)
        if (cb == 'get_account' && (errorMsg.search('unknown key') > -1)) {
          retry = 5
          throw (error)
        } else {
          errorCounter(url, errorMsg)
          await sleep(ms('8s'))
          throw (error)
        }
      }
    }
    const result = await Promise.race([
      doit(),
      // doit(),
      new Promise((res, reject) => setTimeout(() => reject(new Error("SafeDo Timeout:")), ms('3s')))
    ])
    // console.log('Result:', result);

    return result
  } catch (error) {
    console.error('DoRequest Error:', url)
    retry++
    console.error("RETRY", retry);
    if (retry < 5) return safeDo(cb, params, retry)
  }
}

export async function getAllScopes(params: API.v1.GetTableByScopeParams) {
  let code = params.code
  if (!code) code = env.contractAccount
  let table = params.table
  let lower_bound: any = null
  let rows: any[] = []
  async function loop(): Promise<any> {
    const result = await safeDo('get_table_by_scope', { code, table, limit: -1, lower_bound })
    result.rows.forEach((el: any) => rows.push(el))
    console.log('scopes:', rows.length);

    if (result.more) lower_bound = result.more
    else return
    return loop()
  }
  await loop()
  return rows.map(el => el.scope) as Name[]
}


export async function getFullTable(params: GetTableParams) {
  let code = params.contract
  if (!code) code = env.contractAccount
  let table = params.tableName
  let scope = params.scope
  if (!scope) scope = code
  let type = params.type
  let lower_bound: any = null
  let rows = []
  async function loop() {
    const result = await safeDo('get_table_rows', { code, table, scope, limit: 10, lower_bound, type })
    result.rows.forEach(el => rows.push(el))
    if (result.more) lower_bound = result.next_key
    else return
    return loop()
  }
  await loop()
  if (type) return rows as typeof type[]
  else return rows
}
export function getInfo() {
  return safeDo('get_info')
}
// pickRpc().get_account
export async function getAccount(name: Name): Promise<API.v1.AccountObject> {
  const result = (await safeDo('get_account', name)) as API.v1.AccountObject
  return result
}
export async function doAction(name: NameType, data?: { [key: string]: any } | null, contract?: NameType, authorization?: PermissionLevel[], keys?: PrivateKey[], retry?: number): Promise<DoActionResponse | null> {
  // if (typeof name == String())
  if (!data) data = {}
  if (!contract) contract = Name.from(env.contractAccount)
  if (!authorization) authorization = [PermissionLevel.from({ actor: env.workerAccount, permission: env.workerPermission })]
  // const signedTx:SignedTransaction = await rpc.push_transaction({})

  const info = await getInfo()
  const header = info.getTransactionHeader()
  const action = Action.from({
    authorization,
    account: contract,
    name, data
  })
  // console.log("Pushing:", JSON.stringify(data, null, 2), JSON.stringify(action.toJSON(), null, 2));

  const transaction = Transaction.from({
    ...header,
    actions: [action], max_cpu_usage_ms: 8,
  })
  if (!keys) keys = [env.keys[0]]

  const signatures = keys.map(key => key.signDigest(transaction.signingDigest(info.chain_id)))
  // console.log('signatures:', signatures.length);

  const signedTransaction = SignedTransaction.from({ ...transaction, signatures })

  let receipts: TransactionResponse[] = []
  let errors: any[] = []
  let apis = shuffle([...new Set(rpcs)])
  if (apis.length > 2) {
    apis = apis.splice(0, 2)
  }
  // console.log('Pushing Tx using APIs:', apis.length, apis.map(el => el.endpoint.toString()));

  const timeoutTimer = ms('10s')
  await Promise.all(apis.map(({ endpoint, rpc }) => {
    return Promise.race([
      new Promise((res) => {
        // console.log('Pushing action to endpoint:', endpoint.origin);

        rpc.push_transaction(signedTransaction).then(result => {
          receipts.push({ url: endpoint.origin, receipt: result.processed })
        }).catch((error) => {
          // console.log('Error Type:', typeof error);
          errors.push({ url: endpoint.origin, error: error?.error?.details[0]?.message || JSON.stringify(error?.error, null, 2) })
        }).finally(() => res(null))
      }),
      new Promise((res) => setTimeout(() => {
        errors.push({ url: endpoint.origin, error: "Timeout Error after " + timeoutTimer / 1000 + " seconds" })
        res(null)
      }, timeoutTimer))
    ])
  }))
  // console.log('doAction finished;', receipts, errors);
  interface UniqueErrors {
    endpoints: string[]
    error: string
  }
  let uniqueErrors: UniqueErrors[] = []
  errors.forEach(el => {
    const exists = uniqueErrors.findIndex(el2 => el2.error = el.error)
    if (exists == -1) {
      el.endpoints = [el.url]
      delete el.url
      uniqueErrors.push(el)
    } else {
      uniqueErrors[exists].endpoints.push(el.url)
    }
  })
  return { receipts, errors: uniqueErrors }
}

export function pickRpc(): typeof rpcs[0] {
  const pick = rpcs[rand(0, rpcs.length - 1)]
  // console.log('pickRPC:', pick.endpoint.toString())
  return pick
}

export function pickEndpoint(): string {
  const pick = rpcs[rand(0, rpcs.length - 1)]
  // console.log('pickRPC:', pick.endpoint.toString())
  return pick.endpoint.toString()
}

rpcs = env.endpoints.map(el => {
  provider = new FetchProvider(el.toString(), { fetch })
  client = new APIClient({ provider })
  return { endpoint: el, rpc: client.v1.chain }
})
