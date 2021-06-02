export declare const sleep: (ms: number) => Promise<unknown>;
export declare function cronRunner(jobs: Function[], cutoff: number): Promise<void>;
export declare function shuffle<T>(array: T[]): T[];
export declare function accountExists(name: string): Promise<boolean>;
