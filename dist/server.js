"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ms_1 = __importDefault(require("ms"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const serverActions = __importStar(require("./lib/serverActions.js"));
const basicAuth = __importStar(require("express-basic-auth"));
const istorexit_1 = __importDefault(require("istorexit"));
const express_blacklist_1 = __importDefault(require("express-blacklist"));
const express_cache_middleware_1 = __importDefault(require("express-cache-middleware"));
const cache_manager_1 = __importDefault(require("cache-manager"));
const app = (0, express_1.default)();
let cors = require("cors");
app.set("trust proxy", 1);
let proxy = require("express-http-proxy");
app.use(express_blacklist_1.default.blockRequests("../blacklist.txt"));
function toObject(data) {
    return JSON.parse(JSON.stringify(data, (key, value) => typeof value === "bigint"
        ? parseInt(value.toString())
        : value));
}
const limiter = (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("24h"),
    max: 4
});
const limiter2 = (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("30m"),
    max: 10
});
const cacheMiddleware = new express_cache_middleware_1.default(cache_manager_1.default.caching({
    max: 100,
    store: "memory",
    ttl: 10
}));
const auth = basicAuth.default({
    users: {
        "powerupadmin": "boidisthewoid"
    },
    challenge: true,
    realm: "eospowerupio"
});
app.use(express_1.default.json());
app.use(cors());
let blocklist = [];
let whitelist = [];
app.use(async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const exit = () => {
        console.log("Blocking request From:", ip);
        res.statusCode = 403;
        res.end();
        return;
    };
    if (whitelist.some(el => el == ip))
        return next();
    else if (blocklist.some(el => el == ip))
        return exit();
    else if (await (0, istorexit_1.default)(ip)) {
        console.log("Blocked Tor:", ip);
        blocklist.push(ip);
        console.log("blocklist length:", blocklist.length);
        return exit();
    }
    else {
        whitelist.push(ip);
        console.log("Whitelist length:", whitelist.length);
        next();
    }
});
app.use("/freePowerup/:accountName", limiter, async (req, res) => {
    var _a;
    try {
        console.log("Powerup Request:", (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.accountName, req.headers["x-forwarded-for"] || req.socket.remoteAddress);
        console.log(req.rateLimit);
        const name = String(req.params.accountName).trim().toLowerCase();
        const result = await serverActions.freePowerup(name, req.query);
        if ((result === null || result === void 0 ? void 0 : result.status) == "error") {
            res.statusCode = 400;
        }
        console.log(result);
        res.json({ result: toObject(result), rateLimit: req.rateLimit });
    }
    catch (error) {
        res.statusCode = 500;
        console.log(error);
        res.json(error);
    }
});
app.use("/studio", auth, proxy("http://localhost:5555"));
cacheMiddleware.attach(app);
app.use("/stats", limiter2, async (req, res) => {
    try {
        const result = await serverActions.getStats();
        res.json(toObject(result));
    }
    catch (error) {
        res.statusCode = 500;
        console.log(error);
        res.json(error);
    }
});
app.listen(3000, () => console.log("Server is running on http://localhost:3000"));
//# sourceMappingURL=server.js.map