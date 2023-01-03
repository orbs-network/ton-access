import { expect } from 'chai';
import { getHttpV4Endpoint, getHttpV4Endpoints, Config, Network } from '../src/index';

async function sanityEndpoint(endpoint: string) {
    endpoint += 'block/latest';

    //endpoint = "https://ton.access.orbs.network/4d8be7F95Bd3F8B62C092Ab4D238bEE463E655EE/1/mainnet/ton-api-v4/block/latest";
    const settings = { method: "Get" };
    const res = await fetch(endpoint);
    const jsn = await res.json();
    console.log('endpoint:', endpoint);
    jsn.url = endpoint;
    console.log('seqno', jsn.last.seqno);
    expect(jsn.last.seqno).to.be.above(10000);
}
async function sanity(network: Network) {
    let config: Config = { network };
    // mainnet all nodes    
    let endpoints = await getHttpV4Endpoints(config);
    let calls: Array<Promise<void>> = [];
    for (let endpoint of endpoints) {
        calls.push(sanityEndpoint(endpoint))
    }
    await Promise.all(calls);
    console.log('sanity done!');

}
describe('ton-V4', function () {
    this.timeout(20000);
    it('sanity - mainnet - ok status for all nodes', async () => {
        await sanity('mainnet');
    });
    it('sanity - mainnet - ok status for all nodes', async () => {
        await sanity('testnet');
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


    it('nodes-api nodes length should be > 0', async () => {
        const url = "https://ton.access.orbs.network/nodes";
        const res = await fetch(url);
        const nodes = await res.json() as Node[];
        expect(nodes.length).to.be.above(0);
    });
});
