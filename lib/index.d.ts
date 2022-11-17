import { Nodes } from "./nodes";
declare type EdgeProtocol = "toncenter-api-v2" | "ton-api-v4" | "adnl-proxy";
declare type Network = "mainnet" | "testnet";
export interface Config {
    host?: string;
    gatewayVersion?: number;
    network?: Network;
    protocol?: "default" | "json-rpc" | "rest";
}
export declare class Gateway {
    nodes: Nodes;
    host: string;
    urlVersion: number;
    constructor();
    init(): Promise<void>;
    buildUrls(network?: Network, edgeProtocol?: EdgeProtocol, suffix?: string): string[];
}
export declare function getHttpEndpoints(config?: Config): Promise<string[]>;
export declare function getHttpEndpoint(config?: Config): Promise<string>;
export declare function getTonApiV4Endpoints(config?: Config): Promise<string[]>;
export declare function getTonApiV4Endpoint(config?: Config): Promise<string>;
export {};
