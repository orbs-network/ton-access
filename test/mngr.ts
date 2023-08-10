import { expect } from 'chai';
import { getJson } from './helpers';

describe('Mngr', function () {
    const now = Date.now();
    // mngr/nodes
    it('should return valid and healthy json of /mngr/nodes', async () => {
        const nodes = await getJson('https://ton.access.orbs.network/mngr/nodes');
        expect(nodes.length).greaterThan(0);
        for (const node of nodes) {
            // Mngr has fields
            expect(node.NodeId.length).greaterThan(0);
            expect(node.BackendName.length).greaterThan(0);
            expect(node.Ip.length).greaterThan(0);
            expect(node.Weight).greaterThan(0);
            // check not stale
            const delta = now - node.Mngr.successTS;
            expect(delta).lessThan(2 * 60 * 1000);
            let healthy = true;
            for (const protonet in node.Mngr.health) {
                healthy = healthy && node.Mngr.health[protonet];
            }
            expect(healthy).eq(true);
        }
    });

    it('should return consistent json {IP}/mngr/nodes from all nodes', async () => {
        const nodes = await getJson('https://ton.access.orbs.network/mngr/nodes');
        expect(nodes.length).greaterThan(0);
        for (const node of nodes) {
            const curNodes = await getJson(`http://${node.Ip}/mngr/nodes`);
            expect(curNodes.length).greaterThan(0);
            // compare cur node with node by going one node by one and cmp its fields
            for (let i = 0; i < nodes.length; ++i) {
                // main traits
                expect(nodes[i].NodeId).to.be.eq(curNodes[i].NodeId);
                expect(nodes[i].BackendName).to.be.eq(curNodes[i].BackendName);
                expect(nodes[i].Ip).to.be.eq(curNodes[i].Ip);
                expect(nodes[i].Healthy).to.be.eq(curNodes[i].Healthy);
                // manager traits
                expect(nodes[i].Mngr.code).to.be.eq(curNodes[i].Mngr.code);
            }
        }
    });

    // legacy nodes
    it('nodes-api nodes length should be > 0', async () => {
        const url = "https://ton.access.orbs.network/nodes";
        const res = await fetch(url);
        const nodes = await res.json() as Node[];
        expect(nodes.length).to.be.above(0);
    });
});