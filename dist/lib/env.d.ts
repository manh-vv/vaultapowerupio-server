import { Name, PrivateKey } from '@greymass/eosio';
interface eosioConfig {
    chain: string;
    keys: PrivateKey[];
    endpoints: URL[];
    workerAccount: Name;
    workerPermission: Name;
    contractAccount: Name;
    telegramKey?: string;
    discordKey?: string;
}
declare const config: eosioConfig;
export default config;
