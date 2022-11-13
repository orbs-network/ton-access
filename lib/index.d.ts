import { Nodes } from "./nodes";
declare type Network = "mainnet" | "testnet" | "sandbox";
declare type Protocol = "toncenter-api-v2" | "ton-api-v4" | "adnl-proxy";
export declare class Gateway {
    nodes: Nodes;
    host: string;
    urlVersion: number;
    constructor();
    init(): Promise<void>;
    buildUrls(network?: Network, protocol?: Protocol, suffix?: string): string[];
}
export declare function getTonCenterV2Endpoints(network?: Network, suffix?: string): Promise<string[]>;
export declare function getTonCenterV2Endpoint(network?: Network, suffix?: string): Promise<string>;
export declare function getTonApiV4Endpoints(suffix?: string): Promise<string[]>;
export declare function getTonApiV4Endpoint(suffix?: string): Promise<string>;
export declare function getAdnlProxyEndpoints(): Promise<string[]>;
export {};
