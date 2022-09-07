import { Nodes } from './nodes';

export interface Config {
  urlVersion: number,
  network: "mainnet" | "testnet" | "sandbox",
  protocol: "toncenter",
  host?: string
}

export class Client {
  //////////////////////////////////
  config: Config;
  nodes: Nodes;
  host: string;

  //////////////////////////////////
  constructor(config: Config) {
    this.config = config;
    this.host = config.host || 'ton.gateway.orbs.network';
    this.nodes = new Nodes();
  }
  //////////////////////////////////
  async init() {
    await this.nodes.init(`https://${this.host}/nodes`); // pass host when backend endpoint is ready
  }
  // committee only will be used in L3 only  
  // e.g https://ton.gateway.orbs.network/{node.name}/1/mainnet/toncenter/getMasterchainInfo
  buildUrl(nodeName: string, suffixPath: string) {
    const urlVersion = this.config.urlVersion.toString();
    const network = this.config.network;
    const protocol = this.config.protocol;
    return `https://${this.host}/${nodeName}/${urlVersion}/${network}/${protocol}/${suffixPath}`;
  }
  //////////////////////////////////  
  getNextNodeUrl(suffixPath: string, committeeOnly: boolean = false) {
    if (!this.nodes.topology.length) throw new Error("Call init() first");

    return this.buildUrl(this.nodes.getNextNode().Name, suffixPath);
  }
  //////////////////////////////////
  getRandNodeUrl(suffixPath: string, committeeOnly: boolean = false) {
    if (!this.nodes.topology.length) throw new Error("Call init() first");

    return this.buildUrl(this.nodes.getRandomNode().Name, suffixPath);
  }
}

// debug
async function sanity() {
  const config: Config = {
    urlVersion: 1,
    network: "mainnet",
    protocol: "toncenter"
  };
  // const host = "ton.gateway.orbs.network";

  const c = new Client(config);
  await c.init();
  let url;
  url = c.getNextNodeUrl("getMasterChainInfo");
  url = c.getNextNodeUrl("getMasterChainInfo");
  url = c.getNextNodeUrl("getMasterChainInfo");

  const s = new Set<string>;
  for (let i = 0; i < 20; ++i) {
    s.add(c.getRandNodeUrl("getMasterChainInfo"));
  }
  console.log(s.size);
  // expect(s.size).toBe(2);
}
if (require.main === module) {
  sanity();
}
