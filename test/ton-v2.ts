import { expect } from 'chai';
import { TonClient, Address } from "ton";
import TonWeb from "tonweb";
import { getHttpEndpoint } from '../src/index';


describe('ton-center-V2', function () {
    it('should return ok=true getMasterchainInfo mainnet', async function () {
        let endpoint = await getHttpEndpoint({ protocol: 'rest' });
        endpoint += "getMasterchainInfo"

        console.log("endpoint:", endpoint);

        const res = await fetch(endpoint);
        expect(res).to.not.be.undefined;
        const jsn = await res.json();
        expect(jsn.ok).to.equal(true);
    });
    // it('should return ok=true getMasterchainInfo testnet', async function () {
    //     let endpoint = await getHttpEndpoint({ network: 'testnet' });
    //     endpoint += "getMasterchainInfo"

    //     console.log("endpoint:", endpoint);

    //     const res = await fetch(endpoint);
    //     expect(res).to.not.be.undefined;
    //     const jsn = await res.json();
    //     expect(jsn.ok).to.equal(true);
    // });

    it('jsonRPC POST should return cors headers and content.ok == true', async () => {
        const endpoint = await getHttpEndpoint();
        console.log("endpoint:", endpoint);

        // endpoint += '/jsonRPC' - default
        const body = { "id": "1", "jsonrpc": "2.0", "method": "runGetMethod", "params": { "address": "0:f4f590eb7d85d4f8778afa1771c0f43772304e22c7ec194072ca9fd220368f5c", "method": "get_jetton_data", "stack": [] } };
        const rawResponse = await fetch(endpoint, {
            method: 'POST',
            //mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        // cors headers
        expect(rawResponse.headers.get("access-control-allow-origin")).to.equal("*");
        expect(rawResponse.headers.get("access-control-allow-headers")).to.eq("X-API-key,X-API-key,X-Ton-Client-Version,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type");
        const content = await rawResponse.json();
        // response status
        expect(content.ok).to.eq(true);
    });

    const example = "60583653849101971";
    it('TonClient ton-npm balance should be length like 60583653849101971', async () => {
        const endpoint = await getHttpEndpoint();
        console.log("endpoint:", endpoint);
        const client = new TonClient({ endpoint });

        // make a query to mainnet
        const address = Address.parseFriendly("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N").address;
        const balance = await client.getBalance(address);
        expect(balance).to.not.be.undefined;
        expect(balance.toString().length).to.eq(example.length);
    });

    it('TonWeb v2 balance should be length like 40715907771234645', async () => {
        const endpoint = await getHttpEndpoint(); // get the decentralized RPC endpoint
        const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint)); // initialize tonweb library

        // make some query to mainnet
        const balance = await tonweb.getBalance("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        expect(balance).to.not.be.undefined;
        expect(balance.toString().length).to.eq(example.length);
    });

    // Route API
    it('rout api should work', async () => {
        const endpoint = "https://ton.access.orbs.network/route/1/mainnet/toncenter-api-v2/jsonRPC";
        console.log("rout-endpoint:", endpoint);
        const client = new TonClient({ endpoint });


        // make a query to mainnet
        const address = Address.parseFriendly("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N").address;
        const balance = await client.getBalance(address);
        expect(balance).to.not.be.undefined;
        const example = "60583653849101971";
        expect(balance.toString().length).to.eq(example.length);
    });

});
