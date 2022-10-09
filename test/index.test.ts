import { Gateway, Config, getHttpEndpoint } from '../src/index';

let config: Config = {
    version: 1,
    network: "mainnet",
    protocol: "toncenter-api-v2"
};

test('api', async () => {
    // no config
    let url1 = await getHttpEndpoint();
    let url2 = await getHttpEndpoint(config);
    config.network = "testnet";
    let url3 = await getHttpEndpoint(config);

    // suffixes only to ignore node address
    url1 = url1.substring(74)
    url2 = url2.substring(74)
    url3 = url3.substring(74)

    // def config should produce the same as initialized config
    expect(url1).toEqual(url2);
    // tesnet should not match mainnet
    expect(url2 === url3).toBe(false);
});

const node2Name = '19e116699fd6c7ad754a912af633aafec27cc456'
const node3Name = '1cde611619e2a466c87a23b64870397436082895'

test('NextAndRand', async () => {
    const gateway = new Gateway();
    expect(gateway).toBeDefined();
    await gateway.init();
    // sanity
    const endpoint = "getMasterchainInfo";
    const url2 = gateway.getNextNodeUrl(endpoint);
    const url3 = gateway.getNextNodeUrl(endpoint);
    expect(url2 === url3).toBe(false);
    // the backend is fetched backwards 3 first than 2
    const expect2 = `https://ton.gateway.orbs.network/${node2Name}/1/mainnet/toncenter-api-v2/${endpoint}`;
    const expect3 = `https://ton.gateway.orbs.network/${node3Name}/1/mainnet/toncenter-api-v2/${endpoint}`;
    expect(url2).toBe(expect2);
    expect(url3).toBe(expect3)
    // back to first ur amongst two
    const url4 = gateway.getNextNodeUrl(endpoint);
    expect(url4).toBe(expect2);
    // check out of 20 randoms, there a change
    const s = new Set<string>;
    for (let i = 0; i < 20; ++i) {
        s.add(gateway.getRandNodeUrl(endpoint));
    }
    expect(s.size).toBe(gateway.nodes.topology.length);
});

test('jsonRPC', async () => {
    const url = await getHttpEndpoint();
    // url += '/jsonRPC' - default
    const body = { "id": "1", "jsonrpc": "2.0", "method": "runGetMethod", "params": { "address": "0:f4f590eb7d85d4f8778afa1771c0f43772304e22c7ec194072ca9fd220368f5c", "method": "get_jetton_data", "stack": [] } };
    const rawResponse = await fetch(url, {
        method: 'POST',
        //mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const content = await rawResponse.json();

    expect(content.ok).toBe(true);
});

import { TonClient, Address } from "ton";
test('ton-npm', async () => {
    const endpoint = await getHttpEndpoint();
    const client = new TonClient({ endpoint });

    // make a query to mainnet
    const address = Address.parseFriendly("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N").address;
    const balance = await client.getBalance(address);
    expect(balance).toBeDefined();
    const example = "60583653849101971";
    expect(balance.toString().length).toBe(example.length);
});

// v4
import { TonClient4 } from "ton";
test('ton-v4', async () => {
    const endpoint = await getHttpEndpoint({ protocol: "ton-api-v4" });
    const client4 = new TonClient4({ endpoint });
    let latest = await client4.getLastBlock();
    expect(latest).toBeDefined();
    expect(latest.last.seqno).toBeGreaterThan(0);
});
