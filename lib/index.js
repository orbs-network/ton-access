"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHttpV4Endpoint = exports.getHttpV4Endpoints = exports.getHttpEndpoint = exports.getHttpEndpoints = exports.Access = void 0;
const nodes_1 = require("./nodes");
class Access {
    //////////////////////////////////
    constructor() {
        // default
        this.host = "ton.access.orbs.network";
        this.urlVersion = 1;
        this.nodes = new nodes_1.Nodes();
    }
    //////////////////////////////////
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.nodes.init(`https://${this.host}/nodes`); // pass host when backend endpoint is ready
        });
    }
    //////////////////////////////////
    buildUrls(network, edgeProtocol, suffix) {
        // default params
        if (!suffix)
            suffix = "";
        // remove leading slash
        if (suffix.length)
            suffix = suffix.replace(/^\/+/, "");
        const res = [];
        const len = this.nodes.topology.length;
        for (let i = 0; i < len; ++i) {
            const node = this.nodes.getNextNode();
            const url = `https://${this.host}/${node.Name}/${this.urlVersion}/${network}/${edgeProtocol}/${suffix}`;
            res.push(url);
        }
        return res;
    }
}
exports.Access = Access;
//////////////////////////////
// private get multi endpoints
function getEndpoints(network, edgeProtocol, suffix) {
    return __awaiter(this, void 0, void 0, function* () {
        const access = new Access();
        yield access.init();
        const res = access.buildUrls(network, edgeProtocol, suffix);
        return res;
    });
}
/////////////////////////////////////
// global exported explicit functions
// toncenter multi
function getHttpEndpoints(config) {
    return __awaiter(this, void 0, void 0, function* () {
        // default params
        const network = (config === null || config === void 0 ? void 0 : config.network) ? config.network : "mainnet";
        let suffix = "jsonRPC";
        if ((config === null || config === void 0 ? void 0 : config.protocol) === "rest") {
            suffix = "";
        }
        return yield getEndpoints(network, "toncenter-api-v2", suffix);
    });
}
exports.getHttpEndpoints = getHttpEndpoints;
// toncenter single
function getHttpEndpoint(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoints = yield getHttpEndpoints(config);
        const index = Math.floor(Math.random() * endpoints.length);
        return endpoints[index];
    });
}
exports.getHttpEndpoint = getHttpEndpoint;
// // API V4 - multi
function getHttpV4Endpoints(config) {
    return __awaiter(this, void 0, void 0, function* () {
        // default params
        const network = (config === null || config === void 0 ? void 0 : config.network) ? config.network : "mainnet";
        if ((config === null || config === void 0 ? void 0 : config.protocol) === "json-rpc") {
            throw Error("config.protocol json-rpc is not supported for getTonApiV4Endpoints");
        }
        // any other case suffix should be empty
        const suffix = ""; // this is like rest - default
        // other networks than mainnet are not supported
        return yield getEndpoints(network, "ton-api-v4", suffix);
    });
}
exports.getHttpV4Endpoints = getHttpV4Endpoints;
// API V4 - single
function getHttpV4Endpoint(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoints = yield getHttpV4Endpoints(config);
        const index = Math.floor(Math.random() * endpoints.length);
        return endpoints[index];
    });
}
exports.getHttpV4Endpoint = getHttpV4Endpoint;
// // WS ADNL PROXY
// export async function getAdnlProxyEndpoints(): Promise<string[]> {
//   return [
//     //"ws://ton-http-2:30001"
//     "ws://18.221.31.187:30001",
//     //"ws://3.140.253.61:30001",
//   ];
// }
// export async function getAdnlProxyEndpoint(): Promise<string> {
//   const endpoints = await getAdnlProxyEndpoints();
//   const index = Math.floor(Math.random() * endpoints.length);
//   return endpoints[index];
// }
// import { initLiteClient } from "./debug";
// async function dbg() {
//   const lc = await initLiteClient();
//   try {
//     const info = await lc?.getMasterchainInfo();
//     console.log(info);
//   } catch (e) {
//     console.error(e);
//   }
// }
// dbg();
//# sourceMappingURL=index.js.map