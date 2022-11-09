import { expect } from 'chai';
import { TonClient, Address } from "ton";
import { getTonCenterV2Endpoint } from '../src/index';
describe('ton-center-V2', function () {

    it('should return ok=true getMasterchainInfo mainnet', async function () {
        const endpoint = await getTonCenterV2Endpoint("mainnet", "getMasterchainInfo");
        console.log("endpoint:", endpoint);

        const res = await fetch(endpoint);
        //console.log(expect);
        expect(res).to.not.be.undefined;
        ////expect(res).to.be.defined();
        const jsn = await res.json();
        expect(jsn.ok).to.equal(true);
    });

    it('jsonRPC POST should return cors headers and content.ok == true', async () => {
        const endpoint = await getTonCenterV2Endpoint();
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


    it('ton-npm balance should be length like 60583653849101971', async () => {
        const endpoint = await getTonCenterV2Endpoint();
        const client = new TonClient({ endpoint });

        // make a query to mainnet
        const address = Address.parseFriendly("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N").address;
        const balance = await client.getBalance(address);
        expect(balance).to.not.be.undefined;
        const example = "60583653849101971";
        expect(balance.toString().length).to.eq(example.length);
    });

});
