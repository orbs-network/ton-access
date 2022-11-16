import { expect } from 'chai';
import { getTonApiV4Endpoint } from '../src/index';
import { TonClient4 } from "ton";
import "isomorphic-fetch";

describe('ton-V4', function () {
    it('last should has valid seqno', async () => {
        const endpoint = await getTonApiV4Endpoint();
        console.log("endpoint:", endpoint)
        const client4 = new TonClient4({ endpoint });
        let last = await client4.getLastBlock();
        expect(last).to.not.be.undefined;
        expect(last.last.seqno).to.be.above(24920000);
    });

    ///block/latest
    it('explicit suffix latest block', async () => {
        let endpoint = await getTonApiV4Endpoint();
        endpoint += 'block/latest'
        console.log("endpoint:", endpoint)

        const last = await fetch(endpoint);
        expect(last).to.not.be.undefined;
        const json = await last.json();
        expect(json).to.not.be.undefined;
        expect(json.last.seqno).to.be.above(24920000);
    });


    it('nodes-api nodes length should be > 0', async () => {
        const url = "https://ton.gateway.orbs.network/nodes";
        const res = await fetch(url);
        const nodes = await res.json() as Node[];
        expect(nodes.length).to.be.above(0);
    });
});
