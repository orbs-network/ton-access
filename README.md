# TON Access

Unthrottled anonymous RPC access to TON blockchain via the dozens of decentralized nodes of the Orbs Network.

Access a network of public API endpoints that allow TON dapp clients to make HTTP queries from the browser to TON blockchain (call getters, balances, get block data, etc). Access is unrestricted without an API Key and without requiring dapps to run any backend.

**Supports all popular RPC protocols on TON:**
1. [TonCenter HTTP API v2](https://toncenter.com/api/v2/) - replaces the https://toncenter.com/api/v2/jsonRPC endpoint
2. [TonHub HTTP API v4](https://github.com/ton-foundation/ton-api-v4) - replaces the https://mainnet-v4.tonhubapi.com endpoint
3. [Raw ADNL Proxy](https://github.com/ton-community/ton-lite-client) - coming soon

&nbsp;

# Getting Started

Using NPM:
```
npm install @orbs-network/ton-access
```

Using HTML script:
```html
<script src="https://cdn.jsdelivr.net/gh/orbs-network/ton-access@2.2.2/dist/index.min.js"></script>
```

&nbsp;

## 1. Using TonCenter [HTTP API v2](https://toncenter.com/api/v2/)

### with [ton](https://github.com/tonwhales/ton) library:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "ton";

const endpoint = await getHttpEndpoint(); // get the decentralized RPC endpoint
const client = new TonClient({ endpoint }); // initialize ton library

// make some query to mainnet
const address = Address.parseFriendly("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N").address;
const balance = await client.getBalance(address);
```

### with [TonWeb](https://github.com/toncenter/tonweb) library:

```ts
import { getHttpEndpoint } from "@orbs-network/ton-access";
import TonWeb from "tonweb";

const endpoint = await getHttpEndpoint(); // get the decentralized RPC endpoint
const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint)); // initialize tonweb library

// make some query to mainnet
const balance = await tonweb.getBalance("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
```

### with TonWeb as HTML script:

```html
<script src="https://cdn.jsdelivr.net/gh/orbs-network/ton-access@2.2.0/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/toncenter/tonweb/dist/tonweb.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        TonAccess.getHttpEndpoint().then((endpoint) => { // get the decentralized RPC endpoint
            const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint)); // initialize tonweb library
            // make some query to mainnet
            tonweb.getBalance("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N").then((balance) => {
                console.log(balance);
            });
        });
    });
</script>
```

&nbsp;

## 2. Using TonHub [HTTP API v4](https://github.com/ton-foundation/ton-api-v4)

### with [ton](https://github.com/tonwhales/ton) library:

```ts
import { TonClient4 } from "ton";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";

const endpoint = await getHttpV4Endpoint(); // get the decentralized RPC endpoint
const client4 = new TonClient4({ endpoint }); // initialize ton library

// make some query to mainnet
const latestBlock = await client4.getLastBlock();
const latestBlockNumber = latestBlock.last.seqno;
```

&nbsp;

## 3. Using Raw [ADNL Proxy](https://github.com/ton-community/ton-lite-client)

### with [ton-lite-client](https://github.com/ton-community/ton-lite-client/pull/2) library:

```ts
import { LiteClient, LiteSingleEngine } from "ton-lite-client";
import { getAdnlProxyEndpoint } from "@orbs-network/ton-access";

const { endpoint, publicKey } = await getAdnlProxyEndpoint();
const engine = new LiteSingleEngine({ host: endpoint, publicKey });
const client = new LiteClient({ engine });

// make some query to mainnet
const info = await liteClient.getMasterchainInfo();
```

&nbsp;

# API Reference

Get [TonCenter HTTP API v2](https://toncenter.com/api/v2/) endpoint:
```ts
const endpoint = await getHttpEndpoint(config: Config);
```
Get [TonHub HTTP API v4](https://github.com/ton-foundation/ton-api-v4) endpoint:
```ts
const endpoint = await getHttpV4Endpoint(config: Config);
```
Get [Raw ADNL Proxy](https://github.com/ton-community/ton-lite-client) endpoint:
```ts
const { endpoint, publicKey } = await getAdnlProxyEndpoint(config: Config);
```
Use testnet instead of mainnet:
```ts
const endpoint = await getHttpEndpoint({
  network: "testnet" 
});
```

## Config object:

```ts
interface Config {
  network?: "mainnet" | "testnet" // default: mainnet
  host?: string; // default: "ton.access.orbs.network"
  accessVersion?: number; // default: 1
  protocol?: "default" | "json-rpc" | "rest"; // default: "default"
};
```

* `network` - override which TON network do you want to use:
  * `mainnet` - TON mainnet (default)
  * `testnet` - the first TON testnet  
* `accessVersion` - should always be `1`, reserved for future upgrades of this library
* `protocol` - sub-protocol to use, depends on the type of API:
  * TonCenter HTTP API v2:
    * `default` - json-rpc
    * `json-rpc` - supported
    * `rest`- supported
  * TonHub HTTP API v4:
    * `default` - rest   
    * `json-rpc` - not supported
    * `rest` - supported
  * Raw ADNL Proxy:
    * `default` - adnl
    * `json-rpc` - not supported
    * `rest` - not supported

&nbsp;  

## Benefits of using the Orbs TON Access

1. **No throttling for anonymous users**

    RPC access like https://toncenter.com/api/v2/jsonRPC throttle anonymous users to 1 request per second. Most dapps cannot operate under these restrictions since their users are anonymous. The Orbs Network endpoints are designed to serve anonymous dapp users and will not restrict your users from using your dapp client, except in extreme cases of abuse.
    
2. **No need for registering an API Key**

    RPC access like https://toncenter.com/api/v2/jsonRPC reduce user throttling by requiring you to register an API Key. This API Key cannot be stored client-side since it can be abused (it's supposed to be a secret) and dapps should not run a centralized backend to store this secret since they should be decentralized.

3. **No need to run your own RPC backend**

    If you're building a dapp, your dapp should be decentralized so it can be trustless. If you're running your own centralized backend as part of your dapp, you've made your dapp centralized. If your backend suffers downtime for example, your users will lose access to their funds. If the infrastructure is decentralized, you don't need to worry about it.
    
4. **Decentralized access to the chain**

    By relying on https://toncenter.com/api/v2/jsonRPC, you're relying on a centralized business (toncenter.com), not a protocol. The Orbs Network TON-Access is a decentralized protocol operated by dozens of [independent nodes](https://status.orbs.network) that are all part of the [Orbs Network](https://github.com/orbs-network). The network mainnet is running since 2019 and validators are staked with Proof-of-Stake consensus with over $100 million TVL locked. The network is extremely robust against downtime due to the number of independent nodes.

## Version Changes
>> v2.3.0

* As of this version, the client calls ```edge/mngr/nodes``` instead of ```edge/nodes```
* The resulr comes as an array of nodes in this format
```js
{
  "NodeId": "19e116699fd6c7ad754a912af633aafec27cc456",
  "BackendName": "be2",
  "Ip": "3.142.212.29",
  "Weight": 100,
  "Healthy": "1",
  "Mngr": {
  "updated": "Mon, 27 Feb 2023 13:31:16 GMT",
  "health": {
    "v2-mainnet": true,
    "v2-testnet": true,
    "v4-mainnet": true,
    "v4-testnet": true
  },
  "successTS": 1677504676523,
  "errors": [],
  "code": 200,
  "text": "OK"
  }
},
```
* This way the client is aware of which nodes support which protocol-network and can chose a random node in a more responsible way. 
* Weight field is also taken into consideration during the random node choice.