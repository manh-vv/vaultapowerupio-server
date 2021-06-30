export declare const freeDailyQuota = 4;
export declare const sleep: (ms: number) => Promise<unknown>;
export declare function cronRunner(jobs: Function[], cutoff: number): Promise<void>;
export declare function shuffle<T>(array: T[]): T[];
export declare function accountExists(name: string): Promise<boolean>;
interface QuotaResult {
    nextPowerup?: number;
    quotaAvailable: number;
    error?: string;
}
export declare function checkQuota(userid: string): Promise<QuotaResult>;
export {};
