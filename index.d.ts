declare module "nodes" {
    import "isomorphic-fetch";
    interface Node {
        Name: string;
        Ip: string;
        Healthy: string;
    }
    export class Nodes {
        committee: Set<string>;
        topology: Node[];
        nodeIndex: number;
        constructor();
        init(nodesUrl: string): Promise<void>;
        getNextNode(committeeOnly?: boolean): Node;
        getRandomNode(committeeOnly?: boolean): Node;
    }
}
declare module "index" {
    import { Nodes } from "nodes";
    type EdgeProtocol = "toncenter-api-v2" | "ton-api-v4" | "adnl-proxy";
    type Network = "mainnet" | "testnet";
    export interface Config {
        host?: string;
        gatewayVersion?: number;
        network?: Network;
        protocol?: "default" | "json-rpc" | "rest";
    }
    export class Gateway {
        nodes: Nodes;
        host: string;
        urlVersion: number;
        constructor();
        init(): Promise<void>;
        buildUrls(network?: Network, edgeProtocol?: EdgeProtocol, suffix?: string): string[];
    }
    export function getHttpEndpoints(config?: Config): Promise<string[]>;
    export function getHttpEndpoint(config?: Config): Promise<string>;
    export function getTonApiV4Endpoints(config?: Config): Promise<string[]>;
    export function getTonApiV4Endpoint(config?: Config): Promise<string>;
}
declare module "web" {
    global {
        interface Window {
            TonGateway: object;
        }
    }
}
