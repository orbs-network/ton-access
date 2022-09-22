import 'isomorphic-fetch';

interface Node {
  Name: string;
  Ip: string;
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

    try {
      const response = await fetch(nodesUrl);
      const data = await response.json();
      this.topology = data as Node[];

    } catch (e) {
      console.error(`exception in fetch(${nodesUrl}):`, e);
    }
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
