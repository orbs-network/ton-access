import { expect } from 'chai';
import { getHttpV4Endpoint, getHttpV4Endpoints, Config } from '../src/index';
import { sanity, delay } from './helpers'
import WebSocket from 'ws';

describe('ton-V4', function () {
    this.timeout(10000);
    // mainnet
    it('sanity - mainnet - ok status for all nodes', async () => {
        let config: Config = { network: 'mainnet' };
        let endpoints = await getHttpV4Endpoints(config);
        const results = await sanity(endpoints, '/block/latest');
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
        const results = await sanity(endpoints, '/block/latest');
        for (let res of results) {
            console.log('endpoint:', res.url);
            console.log('seqno', res.last.seqno);
            expect(res.last.seqno).to.be.above(10000);
        }
    });
    ///block/latest
    it('explicit suffix latest block', async () => {
        let endpoint = await getHttpV4Endpoint();
        endpoint += '/block/latest'
        console.log("endpoint:", endpoint)

        const last = await fetch(endpoint);
        expect(last).to.not.be.undefined;
        const json = await last.json();
        expect(json).to.not.be.undefined;
        expect(json.last.seqno).to.be.above(24920000);
    });
    // websocket watch API
    // since dev is down this test wont pass and not deployed to production
    // it('ws watch is working', async () => {
    //     const host = "ws://ton-access-dev:20001"

    //     //const url = host + '/block/watch';
    //     const url = host + '/block/watch/changed';

    //     //const url = host;
    //     let res = false;
    //     let err = false;

    //     const ws = new WebSocket(url);
    //     ws.on('error', (e) => {
    //         err = true;
    //         console.error(e);
    //     });

    //     ws.on('message', function message(data: JSON) {
    //         //console.log('received: %s', data);
    //         console.log('watch websock message received');
    //         res = true;
    //     });

    //     await delay(1000);
    //     ws.close();

    //     expect(res).eq(true);
    //     expect(err).eq(false);
    // });
});
