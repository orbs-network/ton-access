import { Nodes } from "./nodes";

// export interface Config {
//   urlVersion: number,
//   network: "mainnet" | "testnet" | "sandbox",
//   protocol: "toncenter",
//   host?: string
// }

export interface Config {
  version?: number; // default: 1
  network?: "mainnet" | "testnet" | "sandbox"; // default: mainnet
  protocol?: "toncenter-api-v2" | "ton-api-v4" | "adnl-proxy"; // default: toncenter-api-v2
  host?: string; // default: "ton.gateway.orbs.network"
}

export class Gateway {
  //////////////////////////////////
  config: Config;
  nodes: Nodes;

  //////////////////////////////////
  constructor(config?: Config) {
    this.config = {
      version: config?.version || 1,
      network: config?.network || "mainnet",
      protocol: config?.protocol || "toncenter-api-v2",
      host: config?.host || "ton.gateway.orbs.network",
    };

    this.nodes = new Nodes();
  }
  //////////////////////////////////
  async init() {
    await this.nodes.init(`https://${this.config.host}/nodes`); // pass host when backend endpoint is ready
  }
  // committee only will be used in L3 only
  // e.g https://ton.gateway.orbs.network/{node.name}/1/mainnet/toncenter/getMasterchainInfo
  buildUrl(nodeName: string, suffixPath?: string) {
    const urlVersion = this.config.version?.toString() || 1;
    const network = this.config.network;
    const protocol = this.config.protocol;
    let url = `https://${this.config.host}/${nodeName}/${urlVersion}/${network}/${protocol}`;
    // suffix
    if (suffixPath) url += `/${suffixPath}`;
    return url;
  }
  //////////////////////////////////
  getNextNodeUrl(suffixPath?: string, committeeOnly: boolean = false) {
    if (!this.nodes.topology.length) throw new Error("Call init() first");

    return this.buildUrl(this.nodes.getNextNode().Name, suffixPath);
  }
  //////////////////////////////////
  getRandNodeUrl(suffixPath?: string, committeeOnly: boolean = false) {
    if (!this.nodes.topology.length) throw new Error("Call init() first");

    return this.buildUrl(this.nodes.getRandomNode().Name, suffixPath);
  }
}
//////////////////////////////////
// global exported functions
export async function getHttpEndpoint(config?: Config): Promise<string> {
  const gateway = new Gateway(config);
  await gateway.init();
  return gateway.getRandNodeUrl();
}

export async function getWsEndpoint(config?: Config) {
  return undefined;
}

// debug
// async function sanity() {
//   // const config: Config = {
//   //   urlVersion: 1,
//   //   network: "mainnet",
//   //   protocol: "toncenter"
//   // };
//   // const host = "ton.gateway.orbs.network";

//   const httpEndpoint = await getHttpEndpoint();
//   console.log(httpEndpoint);

//   // sanity
//   const endpoint = "getMasterchainInfo";

//   const gw = new Gateway();
//   await gw.init();
//   let url;
//   url = gw.getNextNodeUrl(endpoint);
//   url = gw.getNextNodeUrl(endpoint);
//   url = gw.getNextNodeUrl(endpoint);

//   const s = new Set<string>;
//   for (let i = 0; i < 20; ++i) {
//     s.add(gw.getRandNodeUrl(endpoint));
//   }
//   console.log(s.size);
//   // expect(s.size).toBe(2);
// }
// if (require.main === module) {
//   sanity();
// }
