import { Asset, Float32, Name, Struct, TimePointSec, UInt16, UInt32, UInt64, UInt8 } from '@greymass/eosio';
export declare class Balances extends Struct {
    template_id: UInt32;
    balance: UInt16;
}
export declare class Claim extends Struct {
    donator: Name;
}
export declare class Claimed extends Struct {
    account: Name;
    bronze_unclaimed: UInt8;
    bronze_claimed: UInt16;
    silver_claimed: UInt8;
    gold_claimed: UInt8;
}
export declare class Clrbalances extends Struct {
    scope: Name;
}
export declare class Clrclaimed extends Struct {
}
export declare class Clrconfig extends Struct {
}
export declare class Clrleaderb extends Struct {
    scope: UInt64;
}
export declare class Clrround extends Struct {
    round_id: UInt64;
}
export declare class Clrrounds extends Struct {
}
export declare class NftConfig extends Struct {
    mint_price_min: Asset;
    mint_price_increase_by_rank: Asset;
    mint_quantity_cap_per_rank: UInt16;
    max_bronze_mint_per_round: UInt16;
    deposit_bronze_for_silver: UInt8;
    deposit_silver_for_gold: UInt8;
    bonus_silver_per_bronze_claimed: UInt8;
    bonus_gold_per_silver_claimed: UInt8;
    collection_name: Name;
    schema_name: Name;
    bronze_template_id: UInt32;
    silver_template_id: UInt32;
    gold_template_id: UInt32;
}
export declare class Config extends Struct {
    round_length_sec: UInt64;
    start_time: TimePointSec;
    minimum_donation: Asset;
    enabled: boolean;
    compound_decay_pct: Float32;
    decay_step_sec: UInt64;
    start_decay_after_steps: UInt64;
    nft: NftConfig;
}
export declare class Leaderboard extends Struct {
    donator: Name;
    score: UInt64;
    donated: Asset;
    times: UInt64;
    last_donation: TimePointSec;
}
export declare class Rounds extends Struct {
    id: UInt64;
    total_donated: Asset;
    total_score: UInt64;
    donators: UInt64;
    start: TimePointSec;
    rewarded: boolean;
}
export declare class RewardsData extends Struct {
    donator: Name;
    donated: Asset;
    score: UInt64;
    rank: UInt8;
    bronze_nfts_awarded: UInt8;
}
export declare class Rewardlog extends Struct {
    round_data: Rounds;
    rewards_data: RewardsData[];
}
export declare class Rewardround extends Struct {
    round_id: UInt64;
}
export declare class Rmaccount extends Struct {
    donator: Name;
}
export declare class Setconfig extends Struct {
    cfg: Config;
}
export declare class Simdonation extends Struct {
    donator: Name;
    donation: Asset;
}
export declare class Staked extends Struct {
    template_id: UInt32;
    asset_id: UInt64;
    locked_until: TimePointSec;
}
export declare class Unstake extends Struct {
    owner: Name;
    template_id: UInt32;
}
