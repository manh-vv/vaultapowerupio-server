import { Name, NameType } from "@wharfkit/antelope";
import { ResourceCosts } from "./eosio.js";
import { Logpowerup } from "./types/eospowerupio.types.js";
import { Dopowerup } from "@prisma/client";
import * as nft from "./types/nftTypes.js";
export declare let resourcesCosts: ResourceCosts;
export declare function doPowerup(payer: NameType, receiver: NameType, cpuQuantityMs: number, netQuantityMs: number): Promise<import("./eosio.js").DoActionResponse>;
export declare function doAutoPowerup(payer: NameType, watch_account: NameType, cpuQuantityMs: number, netQuantityMs: number): Promise<any>;
export interface FreePowerupResult {
    status: "success" | "error" | "reachedFreeQuota" | "blacklisted";
    powerupLog?: Logpowerup;
    txid?: string;
    recentPowerups?: Dopowerup[];
    errors?: any[];
    nextPowerup?: number;
}
export declare function loadNftConfig(): Promise<nft.NftConfig>;
export declare function loadAccountStakes(account: NameType): Promise<nft.Staked[]>;
export declare function hasBronzeStake(account: NameType): Promise<boolean>;
export declare function freePowerup(accountName: string | Name, params?: any): Promise<FreePowerupResult>;
export declare function getStats(): Promise<import(".prisma/client").Stats>;
