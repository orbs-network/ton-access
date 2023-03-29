import "isomorphic-fetch";

export type ProtoNet =
  | "v2-mainnet"
  | "v2-testnet"
  | "v4-mainnet"
  | "v4-testnet";

const STALE_PERIOD = 10 * 60 * 1000; // 10 Min

interface Mngr {
  updated: string;
  health: { [key in ProtoNet]: boolean };
  successTS: number;
  errors: string[];
  code: number;
  text: string;
}
export type Node = {
  NodeId: string;
  BackendName: string;
  Ip: string;
  Weight: number;
  Healthy: string;
  Mngr: Mngr;
};
///////////////////////////////////
export class Nodes {
  ///////////////////////////////////
  committee: Set<string>;
  topology: Node[];
  ///////////////////////////////////
  nodeIndex: number;
  initTime: number;
  ///////////////////////////////////
  constructor() {
    this.nodeIndex = -1;
    this.committee = new Set<string>();
    this.topology = [];
    this.initTime = 0;
  }
  ///////////////////////////////////
  async init(nodesUrl: string) {
    // cleanup
    this.nodeIndex = -1;
    this.committee.clear();
    this.topology = [];
    this.initTime = Date.now();

    let topology = [];
    try {
      const response = await fetch(nodesUrl);
      const data = await response.json();
      topology = data as Node[];
    } catch (e) {
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
  }
  getHealthyFor(protonet: ProtoNet): Node[] {
    const res: Node[] = [];
    let staleCount = 0;
    for (const node of this.topology) {
      // not stale (10 min)
      const stale = this.initTime - node.Mngr.successTS > STALE_PERIOD;
      if (!stale && node.Weight > 0 && node.Mngr?.health[protonet]) {
        res.push(node);
      } else if (stale) {
        staleCount++;
      }
    }
    // all stale throw exception
    if (staleCount === this.topology.length) {
      throw new Error(`all nodes manager's data are stale`);
    }
    return res;
  }
  ///////////////////////////////////
  // getNextNode(committeeOnly: boolean = true) {
  //   while (true) {
  //     this.nodeIndex++;
  //     // out of range
  //     if (this.nodeIndex >= this.topology.length) this.nodeIndex = 0;
  //     // if any node is welcome, or node is in committee- return
  //     // if (!committeeOnly || this.committee.has(this.topology[this.nodeIndex].EthAddress))
  //     return this.topology[this.nodeIndex];
  //   }
  // }
  ///////////////////////////////////
  //   getRandomNode(committeeOnly: boolean = true) {
  //     const index = Math.floor(Math.random() * this.topology.length);
  //     // while (true) {
  //     //   index++;
  //     //   if (index >= this.topology.length) index = 0;
  //     // if any node is welcome, or node is in committee- return
  //     // if (!committeeOnly || this.committee.has(this.topology[index].EthAddress)) return this.topology[index];
  //     return this.topology[index];
  //     // }
  //   }
}
