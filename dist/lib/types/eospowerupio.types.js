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
const antelope_1 = require("@wharfkit/antelope");
let AccountRow = class AccountRow extends antelope_1.Struct {
};
exports.AccountRow = AccountRow;
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], AccountRow.prototype, "balance", void 0);
exports.AccountRow = AccountRow = __decorate([
    antelope_1.Struct.type("account_row")
], AccountRow);
let Autobuyram = class Autobuyram extends antelope_1.Struct {
};
exports.Autobuyram = Autobuyram;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Autobuyram.prototype, "payer", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Autobuyram.prototype, "watch_account", void 0);
exports.Autobuyram = Autobuyram = __decorate([
    antelope_1.Struct.type("autobuyram")
], Autobuyram);
let Autopowerup = class Autopowerup extends antelope_1.Struct {
};
exports.Autopowerup = Autopowerup;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Autopowerup.prototype, "payer", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Autopowerup.prototype, "watch_account", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Autopowerup.prototype, "net_frac", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Autopowerup.prototype, "cpu_frac", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Autopowerup.prototype, "max_payment", void 0);
exports.Autopowerup = Autopowerup = __decorate([
    antelope_1.Struct.type("autopowerup")
], Autopowerup);
let Billaccount = class Billaccount extends antelope_1.Struct {
};
exports.Billaccount = Billaccount;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Billaccount.prototype, "owner", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Billaccount.prototype, "contract", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset.SymbolCode),
    __metadata("design:type", antelope_1.Asset.SymbolCode)
], Billaccount.prototype, "symcode", void 0);
exports.Billaccount = Billaccount = __decorate([
    antelope_1.Struct.type("billaccount")
], Billaccount);
let Clearconfig = class Clearconfig extends antelope_1.Struct {
};
exports.Clearconfig = Clearconfig;
exports.Clearconfig = Clearconfig = __decorate([
    antelope_1.Struct.type("clearconfig")
], Clearconfig);
let Clrwhitelist = class Clrwhitelist extends antelope_1.Struct {
};
exports.Clrwhitelist = Clrwhitelist;
exports.Clrwhitelist = Clrwhitelist = __decorate([
    antelope_1.Struct.type("clrwhitelist")
], Clrwhitelist);
let Config = class Config extends antelope_1.Struct {
};
exports.Config = Config;
__decorate([
    antelope_1.Struct.field(antelope_1.Float32),
    __metadata("design:type", antelope_1.Float32)
], Config.prototype, "fee_pct", void 0);
__decorate([
    antelope_1.Struct.field("bool"),
    __metadata("design:type", Boolean)
], Config.prototype, "freeze", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Config.prototype, "per_action_fee", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Config.prototype, "minimum_fee", void 0);
__decorate([
    antelope_1.Struct.field("string"),
    __metadata("design:type", String)
], Config.prototype, "memo", void 0);
exports.Config = Config = __decorate([
    antelope_1.Struct.type("config")
], Config);
let Dobuyram = class Dobuyram extends antelope_1.Struct {
};
exports.Dobuyram = Dobuyram;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Dobuyram.prototype, "payer", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Dobuyram.prototype, "receiver", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt32),
    __metadata("design:type", antelope_1.UInt32)
], Dobuyram.prototype, "bytes", void 0);
exports.Dobuyram = Dobuyram = __decorate([
    antelope_1.Struct.type("dobuyram")
], Dobuyram);
let Dopowerup = class Dopowerup extends antelope_1.Struct {
};
exports.Dopowerup = Dopowerup;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Dopowerup.prototype, "payer", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Dopowerup.prototype, "receiver", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Dopowerup.prototype, "net_frac", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Dopowerup.prototype, "cpu_frac", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Dopowerup.prototype, "max_payment", void 0);
exports.Dopowerup = Dopowerup = __decorate([
    antelope_1.Struct.type("dopowerup")
], Dopowerup);
let ExtendedSymbol = class ExtendedSymbol extends antelope_1.Struct {
};
exports.ExtendedSymbol = ExtendedSymbol;
__decorate([
    antelope_1.Struct.field(antelope_1.Asset.Symbol),
    __metadata("design:type", antelope_1.Asset.Symbol)
], ExtendedSymbol.prototype, "sym", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], ExtendedSymbol.prototype, "contract", void 0);
exports.ExtendedSymbol = ExtendedSymbol = __decorate([
    antelope_1.Struct.type("extended_symbol")
], ExtendedSymbol);
let Logbuyram = class Logbuyram extends antelope_1.Struct {
};
exports.Logbuyram = Logbuyram;
__decorate([
    antelope_1.Struct.field("string"),
    __metadata("design:type", String)
], Logbuyram.prototype, "message", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Logbuyram.prototype, "action", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Logbuyram.prototype, "payer", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Logbuyram.prototype, "receiver", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Logbuyram.prototype, "cost", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Logbuyram.prototype, "fee", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Logbuyram.prototype, "total_billed", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Float32),
    __metadata("design:type", antelope_1.Float32)
], Logbuyram.prototype, "received_ram_kb", void 0);
exports.Logbuyram = Logbuyram = __decorate([
    antelope_1.Struct.type("logbuyram")
], Logbuyram);
let Logpowerup = class Logpowerup extends antelope_1.Struct {
};
exports.Logpowerup = Logpowerup;
__decorate([
    antelope_1.Struct.field("string"),
    __metadata("design:type", String)
], Logpowerup.prototype, "message", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Logpowerup.prototype, "action", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Logpowerup.prototype, "payer", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Logpowerup.prototype, "receiver", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Logpowerup.prototype, "cost", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Logpowerup.prototype, "fee", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Logpowerup.prototype, "total_billed", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Float32),
    __metadata("design:type", antelope_1.Float32)
], Logpowerup.prototype, "received_cpu_ms", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Float32),
    __metadata("design:type", antelope_1.Float32)
], Logpowerup.prototype, "received_net_kb", void 0);
exports.Logpowerup = Logpowerup = __decorate([
    antelope_1.Struct.type("logpowerup")
], Logpowerup);
let Open = class Open extends antelope_1.Struct {
};
exports.Open = Open;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Open.prototype, "owner", void 0);
__decorate([
    antelope_1.Struct.field(ExtendedSymbol),
    __metadata("design:type", ExtendedSymbol)
], Open.prototype, "extsymbol", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Open.prototype, "ram_payer", void 0);
exports.Open = Open = __decorate([
    antelope_1.Struct.type("open")
], Open);
let Rmwatchaccnt = class Rmwatchaccnt extends antelope_1.Struct {
};
exports.Rmwatchaccnt = Rmwatchaccnt;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Rmwatchaccnt.prototype, "owner", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Rmwatchaccnt.prototype, "watch_account", void 0);
exports.Rmwatchaccnt = Rmwatchaccnt = __decorate([
    antelope_1.Struct.type("rmwatchaccnt")
], Rmwatchaccnt);
let Setconfig = class Setconfig extends antelope_1.Struct {
};
exports.Setconfig = Setconfig;
__decorate([
    antelope_1.Struct.field(Config),
    __metadata("design:type", Config)
], Setconfig.prototype, "cfg", void 0);
exports.Setconfig = Setconfig = __decorate([
    antelope_1.Struct.type("setconfig")
], Setconfig);
let State = class State extends antelope_1.Struct {
};
exports.State = State;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], State.prototype, "contract", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], State.prototype, "balance", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], State.prototype, "receiver", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], State.prototype, "action", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Float32),
    __metadata("design:type", antelope_1.Float32)
], State.prototype, "received_cpu_ms", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Float32),
    __metadata("design:type", antelope_1.Float32)
], State.prototype, "received_net_kb", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Float32),
    __metadata("design:type", antelope_1.Float32)
], State.prototype, "received_ram_kb", void 0);
__decorate([
    antelope_1.Struct.field("string"),
    __metadata("design:type", String)
], State.prototype, "memo", void 0);
exports.State = State = __decorate([
    antelope_1.Struct.type("state")
], State);
let Sxrebalance = class Sxrebalance extends antelope_1.Struct {
};
exports.Sxrebalance = Sxrebalance;
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Sxrebalance.prototype, "maintain_bal", void 0);
exports.Sxrebalance = Sxrebalance = __decorate([
    antelope_1.Struct.type("sxrebalance")
], Sxrebalance);
let TknwhitelistRow = class TknwhitelistRow extends antelope_1.Struct {
};
exports.TknwhitelistRow = TknwhitelistRow;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], TknwhitelistRow.prototype, "contract", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], TknwhitelistRow.prototype, "max_deposit", void 0);
exports.TknwhitelistRow = TknwhitelistRow = __decorate([
    antelope_1.Struct.type("tknwhitelist_row")
], TknwhitelistRow);
let WatchlistRow = class WatchlistRow extends antelope_1.Struct {
};
exports.WatchlistRow = WatchlistRow;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], WatchlistRow.prototype, "account", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt16),
    __metadata("design:type", antelope_1.UInt16)
], WatchlistRow.prototype, "min_cpu_ms", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt16),
    __metadata("design:type", antelope_1.UInt16)
], WatchlistRow.prototype, "powerup_quantity_ms", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt16),
    __metadata("design:type", antelope_1.UInt16)
], WatchlistRow.prototype, "min_kb_ram", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt16),
    __metadata("design:type", antelope_1.UInt16)
], WatchlistRow.prototype, "buy_ram_quantity_kb", void 0);
__decorate([
    antelope_1.Struct.field("bool"),
    __metadata("design:type", Boolean)
], WatchlistRow.prototype, "active", void 0);
exports.WatchlistRow = WatchlistRow = __decorate([
    antelope_1.Struct.type("watchlist_row")
], WatchlistRow);
let Watchaccount = class Watchaccount extends antelope_1.Struct {
};
exports.Watchaccount = Watchaccount;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Watchaccount.prototype, "owner", void 0);
__decorate([
    antelope_1.Struct.field(WatchlistRow),
    __metadata("design:type", WatchlistRow)
], Watchaccount.prototype, "watch_data", void 0);
exports.Watchaccount = Watchaccount = __decorate([
    antelope_1.Struct.type("watchaccount")
], Watchaccount);
let Whitelisttkn = class Whitelisttkn extends antelope_1.Struct {
};
exports.Whitelisttkn = Whitelisttkn;
__decorate([
    antelope_1.Struct.field(TknwhitelistRow),
    __metadata("design:type", TknwhitelistRow)
], Whitelisttkn.prototype, "tknwhitelist", void 0);
exports.Whitelisttkn = Whitelisttkn = __decorate([
    antelope_1.Struct.type("whitelisttkn")
], Whitelisttkn);
let Withdraw = class Withdraw extends antelope_1.Struct {
};
exports.Withdraw = Withdraw;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Withdraw.prototype, "owner", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Withdraw.prototype, "quantity", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Withdraw.prototype, "receiver", void 0);
exports.Withdraw = Withdraw = __decorate([
    antelope_1.Struct.type("withdraw")
], Withdraw);
//# sourceMappingURL=eospowerupio.types.js.map