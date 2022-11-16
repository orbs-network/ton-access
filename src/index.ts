import { Nodes } from "./nodes";

type EdgeProtocol = "toncenter-api-v2" | "ton-api-v4" | "adnl-proxy"; // default: toncenter-api-v2
type Network = "mainnet" | "testnet" //| "sandbox"- is deprecated ; // default: mainnet
export interface Config {
  host?: string; // default: "ton.gateway.orbs.network"
  gatewayVersion?: number; // default: 1
  network?: Network;
  protocol?: "default" | "json-rpc" | "rest"; // default: "default"
};
export class Gateway {
  //////////////////////////////////
  // config: Config;
  nodes: Nodes;
  host: string;
  //config: Config;
  urlVersion: number;

  //////////////////////////////////
  constructor() {
    // default
    this.host = "ton.gateway.orbs.network";

    this.urlVersion = 1;

    this.nodes = new Nodes();
  }
  //////////////////////////////////
  async init() {
    await this.nodes.init(`https://${this.host}/nodes`); // pass host when backend endpoint is ready
  }
  //////////////////////////////////
  buildUrls(network?: Network, edgeProtocol?: EdgeProtocol, suffix?: string): string[] {
    // default params
    if (!suffix) suffix = "";

    // remove leading slash
    if (suffix.length) suffix = suffix.replace(/^\/+/, "");

    const res: string[] = [];
    const len = this.nodes.topology.length;
    for (let i = 0; i < len; ++i) {
      const node = this.nodes.getNextNode();
      const url = `https://${this.host}/${node.Name}/${this.urlVersion}/${network}/${edgeProtocol}/${suffix}`;
      res.push(url);
    }
    return res;
  }
}

//////////////////////////////
// private get multi endpoints
async function getEndpoints(network?: Network,
  edgeProtocol?: EdgeProtocol,
  suffix?: string
): Promise<string[]> {
  const gateway = new Gateway();
  await gateway.init();
  const res = gateway.buildUrls(network, edgeProtocol, suffix);
  return res;
}

/////////////////////////////////////
// global exported explicit functions

// toncenter multi
export async function getHttpEndpoints(config?: Config): Promise<string[]> {
  // default params
  const network = config?.network ? config.network : "mainnet"
  let suffix = "jsonRPC";
  if (config?.protocol === "rest") {
    suffix = "";
  }

  return await getEndpoints(network, "toncenter-api-v2", suffix);
}
// toncenter single
export async function getHttpEndpoint(config?: Config): Promise<string> {
  const endpoints = await getHttpEndpoints(config);
  const index = Math.floor(Math.random() * endpoints.length);
  return endpoints[index];
}

// // API V4 - multi
export async function getTonApiV4Endpoints(config?: Config): Promise<string[]> {
  // default params
  const network = config?.network ? config.network : "mainnet"

  if (config?.protocol === 'json-rpc') {
    throw Error('config.protocol json-rpc is not supported for getTonApiV4Endpoints');
  }
  // any other case suffix should be empty
  const suffix = ""; // this is like rest - default

  // other networks than mainnet are not supported
  return await getEndpoints("mainnet", "ton-api-v4", suffix);
}
// API V4 - single
export async function getTonApiV4Endpoint(config?: Config): Promise<string> {
  const endpoints = await getTonApiV4Endpoints(config);
  const index = Math.floor(Math.random() * endpoints.length);
  return endpoints[index];
}

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
//   const lc = await initLiteClient();
//   try {
//     const info = await lc?.getMasterchainInfo();
//     console.log(info);
//   } catch (e) {
//     console.error(e);
//   }
// }
// dbg();
