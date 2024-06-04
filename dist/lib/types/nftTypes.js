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
const antelope_1 = require("@wharfkit/antelope");
let Balances = class Balances extends antelope_1.Struct {
};
exports.Balances = Balances;
__decorate([
    antelope_1.Struct.field(antelope_1.UInt32),
    __metadata("design:type", antelope_1.UInt32)
], Balances.prototype, "template_id", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt16),
    __metadata("design:type", antelope_1.UInt16)
], Balances.prototype, "balance", void 0);
exports.Balances = Balances = __decorate([
    antelope_1.Struct.type("balances")
], Balances);
let Claim = class Claim extends antelope_1.Struct {
};
exports.Claim = Claim;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Claim.prototype, "donator", void 0);
exports.Claim = Claim = __decorate([
    antelope_1.Struct.type("claim")
], Claim);
let Claimed = class Claimed extends antelope_1.Struct {
};
exports.Claimed = Claimed;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Claimed.prototype, "account", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt8),
    __metadata("design:type", antelope_1.UInt8)
], Claimed.prototype, "bronze_unclaimed", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt16),
    __metadata("design:type", antelope_1.UInt16)
], Claimed.prototype, "bronze_claimed", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt8),
    __metadata("design:type", antelope_1.UInt8)
], Claimed.prototype, "silver_claimed", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt8),
    __metadata("design:type", antelope_1.UInt8)
], Claimed.prototype, "gold_claimed", void 0);
exports.Claimed = Claimed = __decorate([
    antelope_1.Struct.type("claimed")
], Claimed);
let Clrbalances = class Clrbalances extends antelope_1.Struct {
};
exports.Clrbalances = Clrbalances;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Clrbalances.prototype, "scope", void 0);
exports.Clrbalances = Clrbalances = __decorate([
    antelope_1.Struct.type("clrbalances")
], Clrbalances);
let Clrclaimed = class Clrclaimed extends antelope_1.Struct {
};
exports.Clrclaimed = Clrclaimed;
exports.Clrclaimed = Clrclaimed = __decorate([
    antelope_1.Struct.type("clrclaimed")
], Clrclaimed);
let Clrconfig = class Clrconfig extends antelope_1.Struct {
};
exports.Clrconfig = Clrconfig;
exports.Clrconfig = Clrconfig = __decorate([
    antelope_1.Struct.type("clrconfig")
], Clrconfig);
let Clrleaderb = class Clrleaderb extends antelope_1.Struct {
};
exports.Clrleaderb = Clrleaderb;
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Clrleaderb.prototype, "scope", void 0);
exports.Clrleaderb = Clrleaderb = __decorate([
    antelope_1.Struct.type("clrleaderb")
], Clrleaderb);
let Clrround = class Clrround extends antelope_1.Struct {
};
exports.Clrround = Clrround;
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Clrround.prototype, "round_id", void 0);
exports.Clrround = Clrround = __decorate([
    antelope_1.Struct.type("clrround")
], Clrround);
let Clrrounds = class Clrrounds extends antelope_1.Struct {
};
exports.Clrrounds = Clrrounds;
exports.Clrrounds = Clrrounds = __decorate([
    antelope_1.Struct.type("clrrounds")
], Clrrounds);
let NftConfig = class NftConfig extends antelope_1.Struct {
};
exports.NftConfig = NftConfig;
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], NftConfig.prototype, "mint_price_min", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], NftConfig.prototype, "mint_price_increase_by_rank", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt16),
    __metadata("design:type", antelope_1.UInt16)
], NftConfig.prototype, "mint_quantity_cap_per_rank", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt16),
    __metadata("design:type", antelope_1.UInt16)
], NftConfig.prototype, "max_bronze_mint_per_round", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt8),
    __metadata("design:type", antelope_1.UInt8)
], NftConfig.prototype, "deposit_bronze_for_silver", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt8),
    __metadata("design:type", antelope_1.UInt8)
], NftConfig.prototype, "deposit_silver_for_gold", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt8),
    __metadata("design:type", antelope_1.UInt8)
], NftConfig.prototype, "bonus_silver_per_bronze_claimed", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt8),
    __metadata("design:type", antelope_1.UInt8)
], NftConfig.prototype, "bonus_gold_per_silver_claimed", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], NftConfig.prototype, "collection_name", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], NftConfig.prototype, "schema_name", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt32),
    __metadata("design:type", antelope_1.UInt32)
], NftConfig.prototype, "bronze_template_id", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt32),
    __metadata("design:type", antelope_1.UInt32)
], NftConfig.prototype, "silver_template_id", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt32),
    __metadata("design:type", antelope_1.UInt32)
], NftConfig.prototype, "gold_template_id", void 0);
exports.NftConfig = NftConfig = __decorate([
    antelope_1.Struct.type("nft_config")
], NftConfig);
let Config = class Config extends antelope_1.Struct {
};
exports.Config = Config;
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Config.prototype, "round_length_sec", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.TimePointSec),
    __metadata("design:type", antelope_1.TimePointSec)
], Config.prototype, "start_time", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Config.prototype, "minimum_donation", void 0);
__decorate([
    antelope_1.Struct.field("bool"),
    __metadata("design:type", Boolean)
], Config.prototype, "enabled", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Float32),
    __metadata("design:type", antelope_1.Float32)
], Config.prototype, "compound_decay_pct", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Config.prototype, "decay_step_sec", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Config.prototype, "start_decay_after_steps", void 0);
__decorate([
    antelope_1.Struct.field(NftConfig),
    __metadata("design:type", NftConfig)
], Config.prototype, "nft", void 0);
exports.Config = Config = __decorate([
    antelope_1.Struct.type("config")
], Config);
let Leaderboard = class Leaderboard extends antelope_1.Struct {
};
exports.Leaderboard = Leaderboard;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Leaderboard.prototype, "donator", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Leaderboard.prototype, "score", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Leaderboard.prototype, "donated", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Leaderboard.prototype, "times", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.TimePointSec),
    __metadata("design:type", antelope_1.TimePointSec)
], Leaderboard.prototype, "last_donation", void 0);
exports.Leaderboard = Leaderboard = __decorate([
    antelope_1.Struct.type("leaderboard")
], Leaderboard);
let Rounds = class Rounds extends antelope_1.Struct {
};
exports.Rounds = Rounds;
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Rounds.prototype, "id", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Rounds.prototype, "total_donated", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Rounds.prototype, "total_score", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Rounds.prototype, "donators", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.TimePointSec),
    __metadata("design:type", antelope_1.TimePointSec)
], Rounds.prototype, "start", void 0);
__decorate([
    antelope_1.Struct.field("bool"),
    __metadata("design:type", Boolean)
], Rounds.prototype, "rewarded", void 0);
exports.Rounds = Rounds = __decorate([
    antelope_1.Struct.type("rounds")
], Rounds);
let RewardsData = class RewardsData extends antelope_1.Struct {
};
exports.RewardsData = RewardsData;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], RewardsData.prototype, "donator", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], RewardsData.prototype, "donated", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], RewardsData.prototype, "score", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt8),
    __metadata("design:type", antelope_1.UInt8)
], RewardsData.prototype, "rank", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt8),
    __metadata("design:type", antelope_1.UInt8)
], RewardsData.prototype, "bronze_nfts_awarded", void 0);
exports.RewardsData = RewardsData = __decorate([
    antelope_1.Struct.type("rewards_data")
], RewardsData);
let Rewardlog = class Rewardlog extends antelope_1.Struct {
};
exports.Rewardlog = Rewardlog;
__decorate([
    antelope_1.Struct.field(Rounds),
    __metadata("design:type", Rounds)
], Rewardlog.prototype, "round_data", void 0);
__decorate([
    antelope_1.Struct.field(RewardsData, { array: true }),
    __metadata("design:type", Array)
], Rewardlog.prototype, "rewards_data", void 0);
exports.Rewardlog = Rewardlog = __decorate([
    antelope_1.Struct.type("rewardlog")
], Rewardlog);
let Rewardround = class Rewardround extends antelope_1.Struct {
};
exports.Rewardround = Rewardround;
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Rewardround.prototype, "round_id", void 0);
exports.Rewardround = Rewardround = __decorate([
    antelope_1.Struct.type("rewardround")
], Rewardround);
let Rmaccount = class Rmaccount extends antelope_1.Struct {
};
exports.Rmaccount = Rmaccount;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Rmaccount.prototype, "donator", void 0);
exports.Rmaccount = Rmaccount = __decorate([
    antelope_1.Struct.type("rmaccount")
], Rmaccount);
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
let Simdonation = class Simdonation extends antelope_1.Struct {
};
exports.Simdonation = Simdonation;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Simdonation.prototype, "donator", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.Asset),
    __metadata("design:type", antelope_1.Asset)
], Simdonation.prototype, "donation", void 0);
exports.Simdonation = Simdonation = __decorate([
    antelope_1.Struct.type("simdonation")
], Simdonation);
let Staked = class Staked extends antelope_1.Struct {
};
exports.Staked = Staked;
__decorate([
    antelope_1.Struct.field(antelope_1.UInt32),
    __metadata("design:type", antelope_1.UInt32)
], Staked.prototype, "template_id", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt64),
    __metadata("design:type", antelope_1.UInt64)
], Staked.prototype, "asset_id", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.TimePointSec),
    __metadata("design:type", antelope_1.TimePointSec)
], Staked.prototype, "locked_until", void 0);
exports.Staked = Staked = __decorate([
    antelope_1.Struct.type("staked")
], Staked);
let Unstake = class Unstake extends antelope_1.Struct {
};
exports.Unstake = Unstake;
__decorate([
    antelope_1.Struct.field(antelope_1.Name),
    __metadata("design:type", antelope_1.Name)
], Unstake.prototype, "owner", void 0);
__decorate([
    antelope_1.Struct.field(antelope_1.UInt32),
    __metadata("design:type", antelope_1.UInt32)
], Unstake.prototype, "template_id", void 0);
exports.Unstake = Unstake = __decorate([
    antelope_1.Struct.type("unstake")
], Unstake);
//# sourceMappingURL=nftTypes.js.map