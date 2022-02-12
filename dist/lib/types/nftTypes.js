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
exports.Unstake = exports.Staked = exports.Simdonation = exports.Setconfig = exports.Rmaccount = exports.Rewardround = exports.Rewardlog = exports.RewardsData = exports.Rounds = exports.Leaderboard = exports.Config = exports.NftConfig = exports.Clrrounds = exports.Clrround = exports.Clrleaderb = exports.Clrconfig = exports.Clrclaimed = exports.Clrbalances = exports.Claimed = exports.Claim = exports.Balances = void 0;
const eosio_1 = require("@greymass/eosio");
let Balances = class Balances extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.UInt32),
    __metadata("design:type", eosio_1.UInt32)
], Balances.prototype, "template_id", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt16),
    __metadata("design:type", eosio_1.UInt16)
], Balances.prototype, "balance", void 0);
Balances = __decorate([
    eosio_1.Struct.type('balances')
], Balances);
exports.Balances = Balances;
let Claim = class Claim extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Claim.prototype, "donator", void 0);
Claim = __decorate([
    eosio_1.Struct.type('claim')
], Claim);
exports.Claim = Claim;
let Claimed = class Claimed extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Claimed.prototype, "account", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt8),
    __metadata("design:type", eosio_1.UInt8)
], Claimed.prototype, "bronze_unclaimed", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt16),
    __metadata("design:type", eosio_1.UInt16)
], Claimed.prototype, "bronze_claimed", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt8),
    __metadata("design:type", eosio_1.UInt8)
], Claimed.prototype, "silver_claimed", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt8),
    __metadata("design:type", eosio_1.UInt8)
], Claimed.prototype, "gold_claimed", void 0);
Claimed = __decorate([
    eosio_1.Struct.type('claimed')
], Claimed);
exports.Claimed = Claimed;
let Clrbalances = class Clrbalances extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Clrbalances.prototype, "scope", void 0);
Clrbalances = __decorate([
    eosio_1.Struct.type('clrbalances')
], Clrbalances);
exports.Clrbalances = Clrbalances;
let Clrclaimed = class Clrclaimed extends eosio_1.Struct {
};
Clrclaimed = __decorate([
    eosio_1.Struct.type('clrclaimed')
], Clrclaimed);
exports.Clrclaimed = Clrclaimed;
let Clrconfig = class Clrconfig extends eosio_1.Struct {
};
Clrconfig = __decorate([
    eosio_1.Struct.type('clrconfig')
], Clrconfig);
exports.Clrconfig = Clrconfig;
let Clrleaderb = class Clrleaderb extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Clrleaderb.prototype, "scope", void 0);
Clrleaderb = __decorate([
    eosio_1.Struct.type('clrleaderb')
], Clrleaderb);
exports.Clrleaderb = Clrleaderb;
let Clrround = class Clrround extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Clrround.prototype, "round_id", void 0);
Clrround = __decorate([
    eosio_1.Struct.type('clrround')
], Clrround);
exports.Clrround = Clrround;
let Clrrounds = class Clrrounds extends eosio_1.Struct {
};
Clrrounds = __decorate([
    eosio_1.Struct.type('clrrounds')
], Clrrounds);
exports.Clrrounds = Clrrounds;
let NftConfig = class NftConfig extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], NftConfig.prototype, "mint_price_min", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], NftConfig.prototype, "mint_price_increase_by_rank", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt16),
    __metadata("design:type", eosio_1.UInt16)
], NftConfig.prototype, "mint_quantity_cap_per_rank", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt16),
    __metadata("design:type", eosio_1.UInt16)
], NftConfig.prototype, "max_bronze_mint_per_round", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt8),
    __metadata("design:type", eosio_1.UInt8)
], NftConfig.prototype, "deposit_bronze_for_silver", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt8),
    __metadata("design:type", eosio_1.UInt8)
], NftConfig.prototype, "deposit_silver_for_gold", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt8),
    __metadata("design:type", eosio_1.UInt8)
], NftConfig.prototype, "bonus_silver_per_bronze_claimed", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt8),
    __metadata("design:type", eosio_1.UInt8)
], NftConfig.prototype, "bonus_gold_per_silver_claimed", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], NftConfig.prototype, "collection_name", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], NftConfig.prototype, "schema_name", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt32),
    __metadata("design:type", eosio_1.UInt32)
], NftConfig.prototype, "bronze_template_id", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt32),
    __metadata("design:type", eosio_1.UInt32)
], NftConfig.prototype, "silver_template_id", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt32),
    __metadata("design:type", eosio_1.UInt32)
], NftConfig.prototype, "gold_template_id", void 0);
NftConfig = __decorate([
    eosio_1.Struct.type('nft_config')
], NftConfig);
exports.NftConfig = NftConfig;
let Config = class Config extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Config.prototype, "round_length_sec", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.TimePointSec),
    __metadata("design:type", eosio_1.TimePointSec)
], Config.prototype, "start_time", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Config.prototype, "minimum_donation", void 0);
__decorate([
    eosio_1.Struct.field('bool'),
    __metadata("design:type", Boolean)
], Config.prototype, "enabled", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Float32),
    __metadata("design:type", eosio_1.Float32)
], Config.prototype, "compound_decay_pct", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Config.prototype, "decay_step_sec", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Config.prototype, "start_decay_after_steps", void 0);
__decorate([
    eosio_1.Struct.field(NftConfig),
    __metadata("design:type", NftConfig)
], Config.prototype, "nft", void 0);
Config = __decorate([
    eosio_1.Struct.type('config')
], Config);
exports.Config = Config;
let Leaderboard = class Leaderboard extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Leaderboard.prototype, "donator", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Leaderboard.prototype, "score", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Leaderboard.prototype, "donated", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Leaderboard.prototype, "times", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.TimePointSec),
    __metadata("design:type", eosio_1.TimePointSec)
], Leaderboard.prototype, "last_donation", void 0);
Leaderboard = __decorate([
    eosio_1.Struct.type('leaderboard')
], Leaderboard);
exports.Leaderboard = Leaderboard;
let Rounds = class Rounds extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Rounds.prototype, "id", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Rounds.prototype, "total_donated", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Rounds.prototype, "total_score", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Rounds.prototype, "donators", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.TimePointSec),
    __metadata("design:type", eosio_1.TimePointSec)
], Rounds.prototype, "start", void 0);
__decorate([
    eosio_1.Struct.field('bool'),
    __metadata("design:type", Boolean)
], Rounds.prototype, "rewarded", void 0);
Rounds = __decorate([
    eosio_1.Struct.type('rounds')
], Rounds);
exports.Rounds = Rounds;
let RewardsData = class RewardsData extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], RewardsData.prototype, "donator", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], RewardsData.prototype, "donated", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], RewardsData.prototype, "score", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt8),
    __metadata("design:type", eosio_1.UInt8)
], RewardsData.prototype, "rank", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt8),
    __metadata("design:type", eosio_1.UInt8)
], RewardsData.prototype, "bronze_nfts_awarded", void 0);
RewardsData = __decorate([
    eosio_1.Struct.type('rewards_data')
], RewardsData);
exports.RewardsData = RewardsData;
let Rewardlog = class Rewardlog extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(Rounds),
    __metadata("design:type", Rounds)
], Rewardlog.prototype, "round_data", void 0);
__decorate([
    eosio_1.Struct.field(RewardsData, { array: true }),
    __metadata("design:type", Array)
], Rewardlog.prototype, "rewards_data", void 0);
Rewardlog = __decorate([
    eosio_1.Struct.type('rewardlog')
], Rewardlog);
exports.Rewardlog = Rewardlog;
let Rewardround = class Rewardround extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Rewardround.prototype, "round_id", void 0);
Rewardround = __decorate([
    eosio_1.Struct.type('rewardround')
], Rewardround);
exports.Rewardround = Rewardround;
let Rmaccount = class Rmaccount extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Rmaccount.prototype, "donator", void 0);
Rmaccount = __decorate([
    eosio_1.Struct.type('rmaccount')
], Rmaccount);
exports.Rmaccount = Rmaccount;
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
let Simdonation = class Simdonation extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Simdonation.prototype, "donator", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.Asset),
    __metadata("design:type", eosio_1.Asset)
], Simdonation.prototype, "donation", void 0);
Simdonation = __decorate([
    eosio_1.Struct.type('simdonation')
], Simdonation);
exports.Simdonation = Simdonation;
let Staked = class Staked extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.UInt32),
    __metadata("design:type", eosio_1.UInt32)
], Staked.prototype, "template_id", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt64),
    __metadata("design:type", eosio_1.UInt64)
], Staked.prototype, "asset_id", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.TimePointSec),
    __metadata("design:type", eosio_1.TimePointSec)
], Staked.prototype, "locked_until", void 0);
Staked = __decorate([
    eosio_1.Struct.type('staked')
], Staked);
exports.Staked = Staked;
let Unstake = class Unstake extends eosio_1.Struct {
};
__decorate([
    eosio_1.Struct.field(eosio_1.Name),
    __metadata("design:type", eosio_1.Name)
], Unstake.prototype, "owner", void 0);
__decorate([
    eosio_1.Struct.field(eosio_1.UInt32),
    __metadata("design:type", eosio_1.UInt32)
], Unstake.prototype, "template_id", void 0);
Unstake = __decorate([
    eosio_1.Struct.type('unstake')
], Unstake);
exports.Unstake = Unstake;
//# sourceMappingURL=nftTypes.js.map