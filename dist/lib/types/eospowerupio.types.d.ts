import { Asset, Float32, Name, Struct, UInt16, UInt32, UInt64 } from "@greymass/eosio";
export declare class AccountRow extends Struct {
    balance: Asset;
}
export declare class Autobuyram extends Struct {
    payer: Name;
    watch_account: Name;
}
export declare class Autopowerup extends Struct {
    payer: Name;
    watch_account: Name;
    net_frac: UInt64;
    cpu_frac: UInt64;
    max_payment: Asset;
}
export declare class Billaccount extends Struct {
    owner: Name;
    contract: Name;
    symcode: Asset.SymbolCode;
}
export declare class Clearconfig extends Struct {
}
export declare class Clrwhitelist extends Struct {
}
export declare class Config extends Struct {
    fee_pct: Float32;
    freeze: boolean;
    per_action_fee: Asset;
    minimum_fee: Asset;
    memo: string;
}
export declare class Dobuyram extends Struct {
    payer: Name;
    receiver: Name;
    bytes: UInt32;
}
export declare class Dopowerup extends Struct {
    payer: Name;
    receiver: Name;
    net_frac: UInt64;
    cpu_frac: UInt64;
    max_payment: Asset;
}
export declare class ExtendedSymbol extends Struct {
    sym: Asset.Symbol;
    contract: Name;
}
export declare class Logbuyram extends Struct {
    message: string;
    action: Name;
    payer: Name;
    receiver: Name;
    cost: Asset;
    fee: Asset;
    total_billed: Asset;
    received_ram_kb: Float32;
}
export declare class Logpowerup extends Struct {
    message: string;
    action: Name;
    payer: Name;
    receiver: Name;
    cost: Asset;
    fee: Asset;
    total_billed: Asset;
    received_cpu_ms: Float32;
    received_net_kb: Float32;
}
export declare class Open extends Struct {
    owner: Name;
    extsymbol: ExtendedSymbol;
    ram_payer: Name;
}
export declare class Rmwatchaccnt extends Struct {
    owner: Name;
    watch_account: Name;
}
export declare class Setconfig extends Struct {
    cfg: Config;
}
export declare class State extends Struct {
    contract: Name;
    balance: Asset;
    receiver: Name;
    action: Name;
    received_cpu_ms: Float32;
    received_net_kb: Float32;
    received_ram_kb: Float32;
    memo: string;
}
export declare class Sxrebalance extends Struct {
    maintain_bal: Asset;
}
export declare class TknwhitelistRow extends Struct {
    contract: Name;
    max_deposit: Asset;
}
export declare class WatchlistRow extends Struct {
    account: Name;
    min_cpu_ms: UInt16;
    powerup_quantity_ms: UInt16;
    min_kb_ram: UInt16;
    buy_ram_quantity_kb: UInt16;
    active: boolean;
}
export declare class Watchaccount extends Struct {
    owner: Name;
    watch_data: WatchlistRow;
}
export declare class Whitelisttkn extends Struct {
    tknwhitelist: TknwhitelistRow;
}
export declare class Withdraw extends Struct {
    owner: Name;
    quantity: Asset;
    receiver: Name;
}
