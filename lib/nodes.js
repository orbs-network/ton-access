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
///////////////////////////////////
class Nodes {
    ///////////////////////////////////
    constructor() {
        this.nodeIndex = -1;
        this.committee = new Set();
        this.topology = [];
    }
    ///////////////////////////////////
    init(nodesUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // cleanup
            this.nodeIndex = -1;
            this.committee.clear();
            this.topology = [];
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
    ///////////////////////////////////
    getNextNode(committeeOnly = true) {
        while (true) {
            this.nodeIndex++;
            // out of range
            if (this.nodeIndex >= this.topology.length)
                this.nodeIndex = 0;
            // if any node is welcome, or node is in committee- return
            // if (!committeeOnly || this.committee.has(this.topology[this.nodeIndex].EthAddress))
            return this.topology[this.nodeIndex];
        }
    }
    ///////////////////////////////////
    getRandomNode(committeeOnly = true) {
        const index = Math.floor(Math.random() * this.topology.length);
        // while (true) {
        //   index++;
        //   if (index >= this.topology.length) index = 0;
        // if any node is welcome, or node is in committee- return
        // if (!committeeOnly || this.committee.has(this.topology[index].EthAddress)) return this.topology[index];
        return this.topology[index];
        // }
    }
}
exports.Nodes = Nodes;
//# sourceMappingURL=nodes.js.map