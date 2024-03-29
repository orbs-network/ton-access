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
exports.Nodes = void 0;
require("isomorphic-fetch");
const STALE_PERIOD = 10 * 60 * 1000; // 10 Min
///////////////////////////////////
class Nodes {
    ///////////////////////////////////
    constructor() {
        this.nodeIndex = -1;
        this.committee = new Set();
        this.topology = [];
        this.initTime = 0;
    }
    ///////////////////////////////////
    init(nodesUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // cleanup
            this.nodeIndex = -1;
            this.committee.clear();
            this.topology = [];
            this.initTime = Date.now();
            let topology = [];
            try {
                const response = yield fetch(nodesUrl);
                const data = yield response.json();
                topology = data;
            }
            catch (e) {
                throw new Error(`exception in fetch(${nodesUrl}): ${e}`);
            }
            // remove unhealthy nodes
            for (const node of topology) {
                if (node.Healthy === "1") {
                    this.topology.push(node);
                }
            }
            if (this.topology.length === 0)
                throw new Error(`no healthy nodes retrieved`);
        });
    }
    getHealthyFor(protonet) {
        var _a;
        const res = [];
        let staleCount = 0;
        for (const node of this.topology) {
            // not stale (10 min)
            const stale = this.initTime - node.Mngr.successTS > STALE_PERIOD;
            if (!stale &&
                node.Weight > 0 &&
                ((_a = node.Mngr) === null || _a === void 0 ? void 0 : _a.health[protonet])) {
                res.push(node);
            }
            else if (stale) {
                staleCount++;
            }
        }
        // all stale throw exception
        if (staleCount === this.topology.length) {
            throw new Error(`all nodes manager's data are stale`);
        }
        return res;
    }
}
exports.Nodes = Nodes;
//# sourceMappingURL=nodes.js.map