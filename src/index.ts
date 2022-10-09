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
  format?: "default" | "json-rpc" | "rest"; // default: "json-rpc"
}

export class Gateway {
  //////////////////////////////////
  config: Config;
  nodes: Nodes;
  formatSuffix: string;

  //////////////////////////////////
  constructor(config?: Config) {
    this.config = {
      version: config?.version || 1,
      network: config?.network || "mainnet",
      protocol: config?.protocol || "toncenter-api-v2",
      host: config?.host || "ton.gateway.orbs.network",
      format: config?.format || "default"
    };

    // inti empty
    this.formatSuffix = "";

    // determind formatSuffix
    switch (this.config.protocol) {
      case "toncenter-api-v2":
        switch (this.config.format) {
          case "json-rpc":
          case "default":
            this.formatSuffix = "jsonRPC";
            break;
          case "rest":
            // leave empty for user to add
            break;
        }
        break;
      case "ton-api-v4":
        switch (this.config.format) {
          case "default":
          case "rest":
            // leave empty for user -or client-lib impl to add suffix
            break;
          case "json-rpc":
            console.error('[json-rpc] format is not supported in [ton-api-v4]');
        }
        break;
    }

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
    if (!suffixPath)
      suffixPath = this.formatSuffix;

    return `https://${this.config.host}/${nodeName}/${urlVersion}/${network}/${protocol}/${suffixPath}`;
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
// import { TonClient4 } from "ton";
// async function sanity() {
//   const endpoint = await getHttpEndpoint({ protocol: "ton-api-v4" });
//   const client4 = new TonClient4({ endpoint });
//   const latest = await client4.getLastBlock();
//   console.log(latest);
// }


// if (require.main === module) {
//   sanity();
// }
