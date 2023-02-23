import { Nodes, Node, ProtoNet } from "./nodes";

export type EdgeProtocol = "toncenter-api-v2" | "ton-api-v4" | "adnl-proxy"; // default: toncenter-api-v2
export type Network = "mainnet" | "testnet"; //| "sandbox"- is deprecated ; // default: mainnet
export interface Config {
  host?: string; // default: "ton.access.orbs.network"
  accessVersion?: number; // default: 1
  network?: Network;
  protocol?: "default" | "json-rpc" | "rest"; // default: "default"
}
export class Access {
  //////////////////////////////////
  // config: Config;
  nodes: Nodes;
  host: string;
  //config: Config;
  urlVersion: number;

  //////////////////////////////////
  constructor() {
    // default
    this.host = "ton.access.orbs.network";

    this.urlVersion = 1;

    this.nodes = new Nodes();
  }
  //////////////////////////////////
  async init() {
    await this.nodes.init(`https://${this.host}/mngr/nodes`); // pass host when backend endpoint is ready
  }
  //////////////////////////////////
  makeProtonet(edgeProtocol: EdgeProtocol, network: Network): ProtoNet {
    let res = '';
    switch (edgeProtocol) {
      case 'toncenter-api-v2':
        res += 'v2-';
        break;
      case 'ton-api-v4':
        res += 'v4-';
        break;
    }
    res += network;
    return res as ProtoNet;
  }
  //////////////////////////////////
  weightedRandom(nodes: Node[]): Node | undefined {
    let sumWeights = 0;
    for (const node of nodes) {
      sumWeights += node.Weight;
    }
    const rnd = Math.floor(Math.random() * sumWeights);

    let cur = 0;
    for (const node of nodes) {
      if (rnd >= cur && rnd < cur + node.Weight)
        return node;
      cur += node.Weight;
    }
  }

  //////////////////////////////////
  buildUrls(
    network?: Network,
    edgeProtocol?: EdgeProtocol,
    suffix?: string,
    single?: boolean
  ): string[] {
    // default params
    if (!suffix) suffix = "";
    if (!edgeProtocol) edgeProtocol = "toncenter-api-v2";
    if (!network) network = "mainnet";

    // remove leading slash
    if (suffix.length) suffix = suffix.replace(/^\/+/, "");

    const res: string[] = [];
    let healthyNodes = this.nodes.getHealthyFor(this.makeProtonet(edgeProtocol, network));
    if (!healthyNodes?.length)
      throw new Error('no healthy nodes');

    // if count < healthNodes length - weighted random
    if (single && healthyNodes.length) {
      const chosen = this.weightedRandom(healthyNodes);
      if (chosen)
        healthyNodes = [chosen];
      else
        throw new Error('weightedRandom return empty');
    }

    for (const node of healthyNodes) {
      let url = `https://${this.host}/${node.NodeId}/${this.urlVersion}/${network}/${edgeProtocol}`;
      // append /suffix only if needed
      if (suffix.length)
        url += `/${suffix}`

      res.push(url);
    }
    return res;
  }
}

//////////////////////////////
// private get multi endpoints
async function getEndpoints(
  network?: Network,
  edgeProtocol?: EdgeProtocol,
  suffix?: string,
  single?: boolean
): Promise<string[]> {
  const access = new Access();
  await access.init();
  const res = access.buildUrls(network, edgeProtocol, suffix, single);
  return res;
}

/////////////////////////////////////
// global exported explicit functions

// toncenter multi
export async function getHttpEndpoints(config?: Config, single?: boolean): Promise<string[]> {
  // default params
  const network = config?.network ? config.network : "mainnet";
  let suffix = "jsonRPC";
  if (config?.protocol === "rest") {
    suffix = "";
  }

  return await getEndpoints(network, "toncenter-api-v2", suffix, single);
}
// toncenter single
export async function getHttpEndpoint(config?: Config): Promise<string> {
  // waited random a single endpoint
  const endpoints = await getHttpEndpoints(config, true);
  return endpoints[0];
}

// // API V4 - multi
export async function getHttpV4Endpoints(config?: Config, single?: boolean): Promise<string[]> {
  // default params
  const network = config?.network ? config.network : "mainnet";

  if (config?.protocol === "json-rpc") {
    throw Error(
      "config.protocol json-rpc is not supported for getTonApiV4Endpoints"
    );
  }
  // any other case suffix should be empty
  const suffix = ""; // this is like rest - default

  // other networks than mainnet are not supported
  return await getEndpoints(network, "ton-api-v4", suffix, single);
}
// API V4 - single
export async function getHttpV4Endpoint(config?: Config): Promise<string> {
  const endpoints = await getHttpV4Endpoints(config, true);
  return endpoints[0];
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
//   // const eps = await getHttpEndpoint();
//   // console.log(eps);
//   const SUM = 100;
//   const config: Config = {
//     network: 'mainnet'
//   }
//   const counter: any = {};
//   for (let i = 0; i < SUM; ++i) {
//     const res = await getHttpEndpoint(config);
//     if (!counter[res])
//       counter[res] = 0;

//     counter[res] += 1;
//   }
// }
// async function dbg() {
//   let config: Config = { network: 'mainnet' };
//   let endpoints = await getHttpV4Endpoints(config);
//   console.log(endpoints);
//   let endpoint = await getHttpV4Endpoint(config);
//   console.log(endpoint);
// }

// dbg();
