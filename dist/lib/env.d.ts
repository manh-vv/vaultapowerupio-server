import { Name, PrivateKey } from "@wharfkit/antelope";
interface eosioConfig {
    chain: string;
    keys: PrivateKey[];
    endpoints: URL[];
    workerAccount: Name;
    workerPermission: Name;
    contractAccount: Name;
    nftContract?: Name;
    telegramKey?: string;
    discordKey?: string;
}
declare const config: eosioConfig;
export default config;
