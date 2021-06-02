"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdraw = exports.Whitelisttkn = exports.Watchaccount = exports.WatchlistRow = exports.TknwhitelistRow = exports.Sxrebalance = exports.State = exports.Setconfig = exports.Rmwatchaccnt = exports.Open = exports.Logpowerup = exports.Logbuyram = exports.ExtendedSymbol = exports.Dopowerup = exports.Dobuyram = exports.Config = exports.Clrwhitelist = exports.Clearconfig = exports.Billaccount = exports.Autopowerup = exports.Autobuyram = exports.AccountRow = void 0;
const eosio_1 = require("@greymass/eosio");
let AccountRow = class AccountRow extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], AccountRow.prototype, "balance", void 0);
AccountRow = __decorate([
    eosio_1.Struct.type('account_row')
], AccountRow);
exports.AccountRow = AccountRow;
let Autobuyram = class Autobuyram extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Autobuyram.prototype, "payer", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Autobuyram.prototype, "watch_account", void 0);
Autobuyram = __decorate([
    eosio_1.Struct.type('autobuyram')
], Autobuyram);
exports.Autobuyram = Autobuyram;
let Autopowerup = class Autopowerup extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Autopowerup.prototype, "payer", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Autopowerup.prototype, "watch_account", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Autopowerup.prototype, "net_frac", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Autopowerup.prototype, "cpu_frac", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Autopowerup.prototype, "max_payment", void 0);
Autopowerup = __decorate([
    eosio_1.Struct.type('autopowerup')
], Autopowerup);
exports.Autopowerup = Autopowerup;
let Billaccount = class Billaccount extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Billaccount.prototype, "owner", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Billaccount.prototype, "contract", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset.SymbolCode),
    __metadata("design:type", eosio_1.Asset.SymbolCode)
], Billaccount.prototype, "symcode", void 0);
Billaccount = __decorate([
    eosio_1.Struct.type('billaccount')
], Billaccount);
exports.Billaccount = Billaccount;
let Clearconfig = class Clearconfig extends eosio_1.Struct {
};
Clearconfig = __decorate([
    eosio_1.Struct.type('clearconfig')
], Clearconfig);
exports.Clearconfig = Clearconfig;
let Clrwhitelist = class Clrwhitelist extends eosio_1.Struct {
};
Clrwhitelist = __decorate([
    eosio_1.Struct.type('clrwhitelist')
], Clrwhitelist);
exports.Clrwhitelist = Clrwhitelist;
let Config = class Config extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Float32),
    __metadata("design:type", eosio_1.Float32)
], Config.prototype, "fee_pct", void 0);
__decorate([
    eosio_1.Struct.field('bool'),
    __metadata("design:type", Boolean)
], Config.prototype, "freeze", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Config.prototype, "per_action_fee", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Config.prototype, "minimum_fee", void 0);
__decorate([
    eosio_1.Struct.field('string'),
    __metadata("design:type", String)
], Config.prototype, "memo", void 0);
Config = __decorate([
    eosio_1.Struct.type('config')
], Config);
exports.Config = Config;
let Dobuyram = class Dobuyram extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Dobuyram.prototype, "payer", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Dobuyram.prototype, "receiver", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt32),
    __metadata("design:type", eosio_1.UInt32)
], Dobuyram.prototype, "bytes", void 0);
Dobuyram = __decorate([
    eosio_1.Struct.type('dobuyram')
], Dobuyram);
exports.Dobuyram = Dobuyram;
let Dopowerup = class Dopowerup extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Dopowerup.prototype, "payer", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Dopowerup.prototype, "receiver", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Dopowerup.prototype, "net_frac", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Dopowerup.prototype, "cpu_frac", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Dopowerup.prototype, "max_payment", void 0);
Dopowerup = __decorate([
    eosio_1.Struct.type('dopowerup')
], Dopowerup);
exports.Dopowerup = Dopowerup;
let ExtendedSymbol = class ExtendedSymbol extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Asset.Symbol),
    __metadata("design:type", eosio_1.Asset.Symbol)
], ExtendedSymbol.prototype, "sym", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], ExtendedSymbol.prototype, "contract", void 0);
ExtendedSymbol = __decorate([
    eosio_1.Struct.type('extended_symbol')
], ExtendedSymbol);
exports.ExtendedSymbol = ExtendedSymbol;
let Logbuyram = class Logbuyram extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field('string'),
    __metadata("design:type", String)
], Logbuyram.prototype, "message", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Logbuyram.prototype, "action", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Logbuyram.prototype, "payer", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Logbuyram.prototype, "receiver", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Logbuyram.prototype, "cost", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Logbuyram.prototype, "fee", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Logbuyram.prototype, "total_billed", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Float32),
    __metadata("design:type", eosio_1.Float32)
], Logbuyram.prototype, "received_ram_kb", void 0);
Logbuyram = __decorate([
    eosio_1.Struct.type('logbuyram')
], Logbuyram);
exports.Logbuyram = Logbuyram;
let Logpowerup = class Logpowerup extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field('string'),
    __metadata("design:type", String)
], Logpowerup.prototype, "message", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Logpowerup.prototype, "action", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Logpowerup.prototype, "payer", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Logpowerup.prototype, "receiver", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Logpowerup.prototype, "cost", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Logpowerup.prototype, "fee", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Logpowerup.prototype, "total_billed", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Float32),
    __metadata("design:type", eosio_1.Float32)
], Logpowerup.prototype, "received_cpu_ms", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Float32),
    __metadata("design:type", eosio_1.Float32)
], Logpowerup.prototype, "received_net_kb", void 0);
Logpowerup = __decorate([
    eosio_1.Struct.type('logpowerup')
], Logpowerup);
exports.Logpowerup = Logpowerup;
let Open = class Open extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Open.prototype, "owner", void 0);
__decorate([
    eosio_1.Struct.field(ExtendedSymbol),
    __metadata("design:type", ExtendedSymbol)
], Open.prototype, "extsymbol", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Open.prototype, "ram_payer", void 0);
Open = __decorate([
    eosio_1.Struct.type('open')
], Open);
exports.Open = Open;
let Rmwatchaccnt = class Rmwatchaccnt extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Rmwatchaccnt.prototype, "owner", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Rmwatchaccnt.prototype, "watch_account", void 0);
Rmwatchaccnt = __decorate([
    eosio_1.Struct.type('rmwatchaccnt')
], Rmwatchaccnt);
exports.Rmwatchaccnt = Rmwatchaccnt;
let Setconfig = class Setconfig extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(Config),
    __metadata("design:type", Config)
], Setconfig.prototype, "cfg", void 0);
Setconfig = __decorate([
    eosio_1.Struct.type('setconfig')
], Setconfig);
exports.Setconfig = Setconfig;
let State = class State extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], State.prototype, "contract", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], State.prototype, "balance", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], State.prototype, "receiver", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], State.prototype, "action", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Float32),
    __metadata("design:type", eosio_1.Float32)
], State.prototype, "received_cpu_ms", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Float32),
    __metadata("design:type", eosio_1.Float32)
], State.prototype, "received_net_kb", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Float32),
    __metadata("design:type", eosio_1.Float32)
], State.prototype, "received_ram_kb", void 0);
__decorate([
    eosio_1.Struct.field('string'),
    __metadata("design:type", String)
], State.prototype, "memo", void 0);
State = __decorate([
    eosio_1.Struct.type('state')
], State);
exports.State = State;
let Sxrebalance = class Sxrebalance extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Sxrebalance.prototype, "maintain_bal", void 0);
Sxrebalance = __decorate([
    eosio_1.Struct.type('sxrebalance')
], Sxrebalance);
exports.Sxrebalance = Sxrebalance;
let TknwhitelistRow = class TknwhitelistRow extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], TknwhitelistRow.prototype, "contract", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], TknwhitelistRow.prototype, "max_deposit", void 0);
TknwhitelistRow = __decorate([
    eosio_1.Struct.type('tknwhitelist_row')
], TknwhitelistRow);
exports.TknwhitelistRow = TknwhitelistRow;
let WatchlistRow = class WatchlistRow extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], WatchlistRow.prototype, "account", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt16),
    __metadata("design:type", eosio_1.UInt16)
], WatchlistRow.prototype, "min_cpu_ms", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt16),
    __metadata("design:type", eosio_1.UInt16)
], WatchlistRow.prototype, "powerup_quantity_ms", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt16),
    __metadata("design:type", eosio_1.UInt16)
], WatchlistRow.prototype, "min_kb_ram", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt16),
    __metadata("design:type", eosio_1.UInt16)
], WatchlistRow.prototype, "buy_ram_quantity_kb", void 0);
__decorate([
    eosio_1.Struct.field('bool'),
    __metadata("design:type", Boolean)
], WatchlistRow.prototype, "active", void 0);
WatchlistRow = __decorate([
    eosio_1.Struct.type('watchlist_row')
], WatchlistRow);
exports.WatchlistRow = WatchlistRow;
let Watchaccount = class Watchaccount extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Watchaccount.prototype, "owner", void 0);
__decorate([
    eosio_1.Struct.field(WatchlistRow),
    __metadata("design:type", WatchlistRow)
], Watchaccount.prototype, "watch_data", void 0);
Watchaccount = __decorate([
    eosio_1.Struct.type('watchaccount')
], Watchaccount);
exports.Watchaccount = Watchaccount;
let Whitelisttkn = class Whitelisttkn extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(TknwhitelistRow),
    __metadata("design:type", TknwhitelistRow)
], Whitelisttkn.prototype, "tknwhitelist", void 0);
Whitelisttkn = __decorate([
    eosio_1.Struct.type('whitelisttkn')
], Whitelisttkn);
exports.Whitelisttkn = Whitelisttkn;
let Withdraw = class Withdraw extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Withdraw.prototype, "owner", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Withdraw.prototype, "quantity", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Withdraw.prototype, "receiver", void 0);
Withdraw = __decorate([
    eosio_1.Struct.type('withdraw')
], Withdraw);
exports.Withdraw = Withdraw;
//# sourceMappingURL=eospowerupio.types.js.map