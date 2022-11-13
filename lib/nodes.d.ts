import "isomorphic-fetch";
interface Node {
    Name: string;
    Ip: string;
    Healthy: string;
}
export declare class Nodes {
    committee: Set<string>;
    topology: Node[];
    nodeIndex: number;
    constructor();
    init(nodesUrl: string): Promise<void>;
    getNextNode(committeeOnly?: boolean): Node;
    getRandomNode(committeeOnly?: boolean): Node;
}
export {};
