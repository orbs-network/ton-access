import { Nodes, Node, ProtoNet } from "./nodes";
export type EdgeProtocol = "toncenter-api-v2" | "ton-api-v4" | "adnl-proxy";
export type Network = "mainnet" | "testnet";
export interface Config {
    host?: string;
    accessVersion?: number;
    network?: Network;
    protocol?: "default" | "json-rpc" | "rest";
}
export declare class Access {
    nodes: Nodes;
    host: string;
    urlVersion: number;
    constructor();
    init(): Promise<void>;
    makeProtonet(edgeProtocol: EdgeProtocol, network: Network): ProtoNet;
    weightedRandom(nodes: Node[]): Node | undefined;
    buildUrls(network?: Network, edgeProtocol?: EdgeProtocol, suffix?: string, single?: boolean): string[];
}
export declare function getHttpEndpoints(config?: Config, single?: boolean): Promise<string[]>;
export declare function getHttpEndpoint(config?: Config): Promise<string>;
export declare function getHttpV4Endpoints(config?: Config, single?: boolean): Promise<string[]>;
export declare function getHttpV4Endpoint(config?: Config): Promise<string>;
