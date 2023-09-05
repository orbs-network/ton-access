import { expect } from 'chai';
import { getHttpEndpoint, Config } from '../src/index';
import { getJson, delay } from './helpers';


describe('Infra', function () {
    this.timeout(30000);
    // mainnet
    it('should have similar distributaion to nodes weight', async () => {
        // get nodes weight
        const nodes = await getJson('https://ton.access.orbs.network/mngr/nodes');
        let totWeight = 0;
        // summarize tot weight
        for (const node of nodes) {
            totWeight += node.Weight;
        }

        // create expected weight dict        
        const edgeWeight: { [key: string]: number } = {};

        for (const node of nodes) {
            const w = node.Weight / totWeight;
            edgeWeight[node.NodeId] = w
        }
        console.log('edge weight')
        console.log(edgeWeight);

        const config: Config = {
            network: 'mainnet'
        }

        const SUM = 100;
        const deviation = 0.11; // not more than 1% deviation
        console.log('allowed deviation:', deviation);

        let calls: Promise<string>[] = [];
        for (let i = 0; i < SUM; ++i) {
            calls.push(getHttpEndpoint(config))
        }
        const endpoints = await Promise.all(calls);
        await delay(1000);
        let counter: any = {};
        const regex = /https:\/\/ton\.access\.orbs\.network\/([a-fA-F0-9]{40})\//;

        // sum count per id        
        for (let ep of endpoints) {
            const match = ep.match(regex);
            const id = match ? match[1] : "UNK";
            if (!counter[id])
                counter[id] = 0;

            counter[id] += 1;
        }

        // calc actual weight per ID
        let arr: number[] = [];
        const actualWeight: { [key: string]: number } = {};
        for (const id in counter) {
            const w = counter[id] / SUM;
            actualWeight[id] = w
            arr.push(w); // for std calc
        }

        console.log('actual weight')
        console.log(actualWeight);

        // console.log('count:');
        // console.log(counter);

        // check the varience if edge balance is not too far from actual
        console.log('diff/distance:');
        for (let id in actualWeight) {
            const diff = Math.abs(actualWeight[id] - edgeWeight[id]);

            console.log(id, diff.toFixed(2));
            expect(diff).to.be.below(deviation);
        }
    });
    // it('should trigger rate limit', async () => {
    //     // v2 default
    //     const endpoint = await getHttpEndpoint();
    //     //const endpoint = 'https://ton.access.orbs.network/44A1c0ff5Bd3F8B62C092Ab4D238bEE463E644A1/1/mainnet/toncenter-api-v2/jsonRPC';
    //     //const endpoint = 'http://178.162.169.1/1/mainnet/toncenter-api-v2/jsonRPC'
    //     console.log("endpoint:", endpoint);
    //     const calls = 1000;
    //     const res = await multiPostCalls(calls, endpoint);
    //     console.log(res);
    //     expect(calls).to.be.above(res.status[200]);
    //     expect(res.status[503]).to.be.above(0);
    // });
    // it('should have all responses 200 OK and all cache be missed', async () => {
    //     // v2 default
    //     const endpoint = await getHttpEndpoint();
    //     console.log("endpoint:", endpoint);
    //     const calls = 1000;
    //     const res = await multiPostCalls(calls, endpoint);
    //     console.log(res);
    //     expect(calls).eq(res.status[200]);
    //     expect(calls).eq(res.cache['MISS']);
    // });

    // it('should not trigger rate limit', async () => {
    //     // v2 default
    //     const endpoint = await getHttpEndpoint();
    //     //const endpoint = 'https://ton.access.orbs.network/44A1c0ff5Bd3F8B62C092Ab4D238bEE463E644A1/1/mainnet/toncenter-api-v2/jsonRPC';
    //     //const endpoint = 'http://178.162.169.1/1/mainnet/toncenter-api-v2/jsonRPC'
    //     console.log("endpoint:", endpoint);

    //     // endpoint += '/jsonRPC' - default
    //     const body = { "id": "1", "jsonrpc": "2.0", "method": "runGetMethod", "params": { "address": "0:f4f590eb7d85d4f8778afa1771c0f43772304e22c7ec194072ca9fd220368f5c", "method": "get_jetton_data", "stack": [] } };
    //     const LIMIT = 1000;
    //     let calls: any[] = []
    //     for (let i = 0; i < LIMIT; ++i) {
    //         calls.push(fetch(endpoint, {
    //             method: 'POST',
    //             //mode: 'cors',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(body)
    //         }));
    //     }
    //     console.log(`performing ${LIMIT} calls at once...`)
    //     const responses = await Promise.all(calls);
    //     console.log(`DONE!`)
    //     const count: { [key: number]: number } = {};
    //     const cache: { [key: string]: number } = {};
    //     for (const r of responses) {
    //         if (!count[r.status])
    //             count[r.status] = 0;
    //         count[r.status] += 1;
    //         if (r.status == 200) {
    //             const xc = r.headers.get('X-Cache');
    //             if (!cache[xc]) {
    //                 cache[xc] = 0;
    //             }
    //             cache[xc] += 1;
    //         }
    //     }
    //     console.log(count);
    //     console.log(cache);
    //     // cors headers
    //     // expect(rawResponse.headers.get("access-control-allow-origin")).to.equal("*");
    //     // expect(rawResponse.headers.get("access-control-allow-headers")).to.eq("X-API-key,X-API-key,X-Ton-Client-Version,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type");
    //     // const content = await rawResponse.json();
    //     // // response status
    //     // expect(content.ok).to.eq(true);

    // });
});