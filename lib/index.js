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
            const pjson = require("../package.json");
            yield this.nodes.init(`https://${this.host}/mngr/nodes?npm_version=${pjson.version}`); // pass host when backend endpoint is ready
        });
    }
    //////////////////////////////////
    makeProtonet(edgeProtocol, network) {
        let res = "";
        switch (edgeProtocol) {
            case "toncenter-api-v2":
                res += "v2-";
                break;
            case "ton-api-v4":
                res += "v4-";
                break;
        }
        res += network;
        return res;
    }
    //////////////////////////////////
    weightedRandom(nodes) {
        let sumWeights = 0;
        for (const node of nodes) {
            sumWeights += node.Weight;
        }
        const rnd = Math.floor(Math.random() * sumWeights);
        let cur = 0;
        for (const node of nodes) {
            if (rnd >= cur && rnd < cur + node.Weight)
                return node;
            cur += node.Weight;
        }
    }
    //////////////////////////////////
    buildUrls(network, edgeProtocol, suffix, single) {
        // default params
        if (!suffix)
            suffix = "";
        if (!edgeProtocol)
            edgeProtocol = "toncenter-api-v2";
        if (!network)
            network = "mainnet";
        // remove leading slash
        if (suffix.length)
            suffix = suffix.replace(/^\/+/, "");
        const res = [];
        const protonet = this.makeProtonet(edgeProtocol, network);
        let healthyNodes = this.nodes.getHealthyFor(protonet);
        if (!(healthyNodes === null || healthyNodes === void 0 ? void 0 : healthyNodes.length))
            throw new Error(`no healthy nodes for ${protonet}`);
        // if count < healthNodes length - weighted random
        if (single && healthyNodes.length) {
            const chosen = this.weightedRandom(healthyNodes);
            if (chosen)
                healthyNodes = [chosen];
            else
                throw new Error("weightedRandom return empty");
        }
        for (const node of healthyNodes) {
            let url = `https://${this.host}/${node.NodeId}/${this.urlVersion}/${network}/${edgeProtocol}`;
            // append /suffix only if needed
            if (suffix.length)
                url += `/${suffix}`;
            res.push(url);
        }
        return res;
    }
}
exports.Access = Access;
//////////////////////////////
// private get multi endpoints
function getEndpoints(network, edgeProtocol, suffix, single) {
    return __awaiter(this, void 0, void 0, function* () {
        const access = new Access();
        yield access.init();
        const res = access.buildUrls(network, edgeProtocol, suffix, single);
        return res;
    });
}
/////////////////////////////////////
// global exported explicit functions
// toncenter multi
function getHttpEndpoints(config, single) {
    return __awaiter(this, void 0, void 0, function* () {
        // default params
        const network = (config === null || config === void 0 ? void 0 : config.network) ? config.network : "mainnet";
        let suffix = "jsonRPC";
        if ((config === null || config === void 0 ? void 0 : config.protocol) === "rest") {
            suffix = "";
        }
        return yield getEndpoints(network, "toncenter-api-v2", suffix, single);
    });
}
exports.getHttpEndpoints = getHttpEndpoints;
// toncenter single
function getHttpEndpoint(config) {
    return __awaiter(this, void 0, void 0, function* () {
        // waited random a single endpoint
        const endpoints = yield getHttpEndpoints(config, true);
        return endpoints[0];
    });
}
exports.getHttpEndpoint = getHttpEndpoint;
// // API V4 - multi
function getHttpV4Endpoints(config, single) {
    return __awaiter(this, void 0, void 0, function* () {
        // default params
        const network = (config === null || config === void 0 ? void 0 : config.network) ? config.network : "mainnet";
        if ((config === null || config === void 0 ? void 0 : config.protocol) === "json-rpc") {
            throw Error("config.protocol json-rpc is not supported for getTonApiV4Endpoints");
        }
        // any other case suffix should be empty
        const suffix = ""; // this is like rest - default
        // other networks than mainnet are not supported
        return yield getEndpoints(network, "ton-api-v4", suffix, single);
    });
}
exports.getHttpV4Endpoints = getHttpV4Endpoints;
// API V4 - single
function getHttpV4Endpoint(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoints = yield getHttpV4Endpoints(config, true);
        return endpoints[0];
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
//   // const eps = await getHttpEndpoint();
//   // console.log(eps);
//   const SUM = 100;
//   const config: Config = {
//     network: 'mainnet'
//   }
//   const counter: any = {};
//   for (let i = 0; i < SUM; ++i) {
//     const res = await getHttpEndpoint(config);
//     if (!counter[res])
//       counter[res] = 0;
//     counter[res] += 1;
//   }
// }
//# sourceMappingURL=index.js.map