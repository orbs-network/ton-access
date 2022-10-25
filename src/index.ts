import { Nodes } from "./nodes";

// export interface Config {
//   urlVersion: number,
//   network: "mainnet" | "testnet" | "sandbox",
//   protocol: "toncenter",
//   host?: string
// }

// export interface Config {
//   version?: number; // default: 1
//   network?: "mainnet" | "testnet" | "sandbox"; // default: mainnet
//   //protocol?: "toncenter-api-v2" | "ton-api-v4" | "adnl-proxy"; // default: toncenter-api-v2
//   host?: string; // default: "ton.gateway.orbs.network"
//   format?: "default" | "json-rpc" | "rest"; // default: "json-rpc"
// }

type Network = "mainnet" | "testnet" | "sandbox";
type Protocol = "toncenter-api-v2" | "ton-api-v4" | "adnl-proxy"; // default: toncenter-api-v2

export class Gateway {
  //////////////////////////////////
  // config: Config;
  nodes: Nodes;
  formatSuffix: string;
  host: string;
  urlVersion: number;

  //////////////////////////////////
  constructor() {
    // this.config = {
    //   version: config?.version || 1,
    //   network: config?.network || "mainnet",
    //   //protocol: config?.protocol || "toncenter-api-v2",
    //   host: config?.host || "ton.gateway.orbs.network",
    //   format: config?.format || "default",
    // };
    this.host = "ton.gateway.orbs.network";
    this.urlVersion = 1;

    // inti empty
    this.formatSuffix = "";

    // determind formatSuffix
    // switch (this.config.protocol) {
    //   case "toncenter-api-v2":
    //     switch (this.config.format) {
    //       case "json-rpc":
    //       case "default":
    //         this.formatSuffix = "jsonRPC";
    //         break;
    //       case "rest":
    //         // leave empty for user to add
    //         break;
    //     }
    //     break;
    //   case "ton-api-v4":
    //     switch (this.config.format) {
    //       case "default":
    //       case "rest":
    //         // leave empty for user -or client-lib impl to add suffix
    //         break;
    //       case "json-rpc":
    //         console.error("[json-rpc] format is not supported in [ton-api-v4]");
    //     }
    //     break;
    // }

    this.nodes = new Nodes();
  }
  //////////////////////////////////
  async init() {
    await this.nodes.init(`https://${this.host}/nodes`); // pass host when backend endpoint is ready
  }
  //////////////////////////////////
  buildUrls(network?: Network, protocol?: Protocol, suffix?: string): string[] {
    // default params
    if (!suffix)
      suffix = "";


    const res: string[] = [];
    const len = this.nodes.topology.length;
    for (let i = 0; i < len; ++i) {
      const node = this.nodes.getNextNode();
      const url = `https://${this.host}/${node.Name}/${this.urlVersion}/${network}/${protocol}/${suffix}`;
      res.push(url);
    }
    return res;
  }

  // committee only will be used in L3 only
  // e.g https://ton.gateway.orbs.network/{node.name}/1/mainnet/toncenter/getMasterchainInfo
  // buildUrl(nodeName: string, suffixPath?: string) {
  //   const urlVersion = this.config.version?.toString() || 1;
  //   const network = this.config.network;
  //   //const protocol = this.config.protocol;
  //   if (!suffixPath) suffixPath = this.formatSuffix;

  //   // testnet and sandbox supported only on toncenter-api-v2
  //   // if (protocol !== "toncenter-api-v2") {
  //   //   switch (network) {
  //   //     case "testnet":
  //   //     case "sandbox":
  //   //       throw new Error(
  //   //         "sandbox and testent are supported only in toncenter-api-v2"
  //   //       );
  //   //   }
  //   // }

  //   return `https://${this.config.host}/${nodeName}/${urlVersion}/${network}/${protocol}/${suffixPath}`;
  // }
  // //////////////////////////////////
  // getNextNodeUrl(suffixPath?: string, committeeOnly: boolean = false) {
  //   if (!this.nodes.topology.length) throw new Error("Call init() first");

  //   return this.buildUrl(this.nodes.getNextNode().Name, suffixPath);
  // }
  // //////////////////////////////////
  // getRandNodeUrl(suffixPath?: string, committeeOnly: boolean = false) {
  //   if (!this.nodes.topology.length) throw new Error("Call init() first");

  //   return this.buildUrl(this.nodes.getRandomNode().Name, suffixPath);
  // }
}
//////////////////////////////////
// global exported functions
// export async function getHttpEndpoint(config?: Config): Promise<string> {
//   const gateway = new Gateway(config);
//   await gateway.init();
//   return gateway.getRandNodeUrl();
// }

// export async function getWsEndpoint(config?: Config) {
//   return undefined;
// }

// toncenter multi
export async function getTonCenterV2Endpoints(network?: Network, suffix?: string): Promise<string[]> {
  // default params
  if (!network)
    network = "mainnet";
  if (!suffix)
    suffix = "jsonRPC";

  const gateway = new Gateway();
  await gateway.init();
  const res = gateway.buildUrls(network, "toncenter-api-v2", suffix);
  return res;
}
// toncenter single
export async function getTonCenterV2Endpoint(network?: Network, suffix?: string): Promise<string> {
  const endpoints = await getTonCenterV2Endpoints(network, suffix);
  const index = Math.floor(Math.random() * endpoints.length);
  return endpoints[index];
}

// API V4 - multi
export async function getTonApiV4Endpoints(): Promise<string[]> {
  const gateway = new Gateway();
  await gateway.init();
  const res = gateway.buildUrls("mainnet", "ton-api-v4");
  return res;

}
// API V4 - single
export async function getTonApiV4Endpoint(): Promise<string> {
  const endpoints = await getTonApiV4Endpoints();
  const index = Math.floor(Math.random() * endpoints.length);
  return endpoints[index];
}