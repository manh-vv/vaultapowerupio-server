import { API, APIClient, Name, PermissionLevel, PrivateKey, NameType } from "@wharfkit/antelope";
declare let client: APIClient;
export declare let rpcs: Array<{
    endpoint: URL;
    rpc: typeof client.v1.chain;
}>;
interface TransactionResponse {
    url: string;
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
    };
}
export interface DoActionResponse {
    receipts: TransactionResponse[];
    errors: any[];
}
interface GetTableParams {
    tableName: NameType;
    scope?: NameType;
    contract?: NameType;
    type?: any;
}
export interface ResourceCosts {
    cpuMsCost: number;
    netKbCost: number;
    msToFrac: number;
    kbToFrac: number;
}
export declare function getResouceCosts(retry?: number): Promise<ResourceCosts | null>;
export declare function safeDo(cb: string, params?: any, retry?: number): Promise<any | null>;
export declare function getAllScopes(params: API.v1.GetTableByScopeParams): Promise<Name[]>;
export declare function getFullTable(params: GetTableParams): Promise<any[]>;
export declare function getInfo(): Promise<any>;
export declare function getAccount(name: Name): Promise<API.v1.AccountObject>;
export declare function doAction(name: NameType, data?: {
    [key: string]: any;
} | null, contract?: NameType, authorization?: PermissionLevel[], keys?: PrivateKey[], retry?: number, max_cpu_usage_ms?: number): Promise<DoActionResponse | null>;
export declare function pickRpc(): typeof rpcs[0];
export declare function pickEndpoint(): string;
export {};
