import { expect } from 'chai';
import { getHttpV4Endpoint, getHttpV4Endpoints, Config } from '../src/index';
import { sanity } from './helpers'

describe('ton-V4', function () {
    this.timeout(10000);
    // mainnet
    it('sanity - mainnet - ok status for all nodes', async () => {
        let config: Config = { network: 'mainnet' };
        let endpoints = await getHttpV4Endpoints(config);
        const results = await sanity(endpoints, 'block/latest');
        for (let res of results) {
            console.log('endpoint:', res.url);
            console.log('seqno', res.last.seqno);
            expect(res.last.seqno).to.be.above(10000);
        }
    });
    // testnet
    it('sanity - testnet - ok status for all nodes', async () => {
        let config: Config = { network: 'testnet' };
        let endpoints = await getHttpV4Endpoints(config);
        const results = await sanity(endpoints, 'block/latest');
        for (let res of results) {
            console.log('endpoint:', res.url);
            console.log('seqno', res.last.seqno);
            expect(res.last.seqno).to.be.above(10000);
        }
    });
    ///block/latest
    it('explicit suffix latest block', async () => {
        let endpoint = await getHttpV4Endpoint();
        endpoint += 'block/latest'
        console.log("endpoint:", endpoint)

        const last = await fetch(endpoint);
        expect(last).to.not.be.undefined;
        const json = await last.json();
        expect(json).to.not.be.undefined;
        expect(json.last.seqno).to.be.above(24920000);
    });
});
