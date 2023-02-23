import { expect } from 'chai';
import { getJson } from './helpers';

describe('Mngr', function () {
    const now = Date.now();
    // mngr/nodes
    it('should return valid json of mngr/nodes', async () => {
        const nodes = await getJson('https://ton.access.orbs.network/mngr/nodes');
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
    // legacy nodes
    it('nodes-api nodes length should be > 0', async () => {
        const url = "https://ton.access.orbs.network/nodes";
        const res = await fetch(url);
        const nodes = await res.json() as Node[];
        expect(nodes.length).to.be.above(0);
    });
});