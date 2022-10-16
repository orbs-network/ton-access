import "isomorphic-fetch";

interface Node {
  Name: string;
  Ip: string;
  Healthy: string;
}
///////////////////////////////////
export class Nodes {
  ///////////////////////////////////
  committee: Set<string>;
  topology: Node[];
  ///////////////////////////////////
  nodeIndex: number;
  ///////////////////////////////////
  constructor() {
    this.nodeIndex = -1;
    this.committee = new Set<string>();
    this.topology = [];
  }
  ///////////////////////////////////
  async init(nodesUrl: string) {
    // cleanup
    this.nodeIndex = -1;
    this.committee.clear();
    this.topology = [];

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
  ///////////////////////////////////
  getNextNode(committeeOnly: boolean = true) {
    while (true) {
      this.nodeIndex++;
      // out of range
      if (this.nodeIndex >= this.topology.length) this.nodeIndex = 0;
      // if any node is welcome, or node is in committee- return
      // if (!committeeOnly || this.committee.has(this.topology[this.nodeIndex].EthAddress))
      return this.topology[this.nodeIndex];
    }
  }
  ///////////////////////////////////
  getRandomNode(committeeOnly: boolean = true) {
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
