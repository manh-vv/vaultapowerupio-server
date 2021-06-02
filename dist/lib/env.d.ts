import { Name, PrivateKey } from '@greymass/eosio';
interface eosioConfig {
    keys: PrivateKey[];
    endpoints: URL[];
    workerAccount: Name;
    workerPermission: Name;
    contractAccount: Name;
    telegramKey?: string;
}
declare const config: eosioConfig;
export default config;
