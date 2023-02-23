import "isomorphic-fetch";
export type ProtoNet = "v2-mainnet" | "v2-testnet" | "v4-mainnet" | "v4-testnet";
interface Mngr {
    updated: string;
    health: {
        [key in ProtoNet]: boolean;
    };
    successTS: number;
    errors: string[];
    code: number;
    text: string;
}
export type Node = {
    NodeId: string;
    BackendName: string;
    Ip: string;
    Weight: number;
    Healthy: string;
    Mngr: Mngr;
};
export declare class Nodes {
    committee: Set<string>;
    topology: Node[];
    nodeIndex: number;
    initTime: number;
    constructor();
    init(nodesUrl: string): Promise<void>;
    getHealthyFor(protonet: ProtoNet): Node[];
}
export {};
