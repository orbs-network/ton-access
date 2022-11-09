import { expect } from 'chai';
import { getTonApiV4Endpoint } from '../src/index';
import { TonClient4 } from "ton";
import "isomorphic-fetch";

describe('ton-V4', function () {
    it('latest should has valid seqno', async () => {
        const endpoint = await getTonApiV4Endpoint();
        const client4 = new TonClient4({ endpoint });
        let latest = await client4.getLastBlock();
        expect(latest).to.not.be.undefined;
        expect(latest.last.seqno).to.be.above(0);
    });


    it('nodes-api nodes length should be > 0', async () => {
        const url = "https://ton.gateway.orbs.network/nodes";
        const res = await fetch(url);
        const nodes = await res.json() as Node[];
        expect(nodes.length).to.be.above(0);
    });
});
