# TON Gateway

Unthrottled anonymous RPC access to TON blockchain via the dozens of decentralized nodes of the Orbs Network.

Access a network of public API endpoints that allow TON dapp clients to make HTTP queries from the browser to TON blockchain (call getters, balances, get block data, etc). Access is unrestricted without an API Key and without requiring dapps to run any backend.

**Supports all popular RPC protocols:**
* [TonCenter HTTP API v2](https://toncenter.com/api/v2/) - live (replaces the https://toncenter.com/api/v2/jsonRPC endpoint)
* [TonHub HTTP API v4](https://github.com/ton-foundation/ton-api-v4) - coming soon (replaces the https://mainnet-v4.tonhubapi.com endpoint)
* [Raw ADNL Proxy](https://github.com/ton-community/ton-lite-client) - coming soon

&nbsp;

## Getting Started
```
npm install @orbs-network/ton-gateway
```
### Using toncenter-api-v2 Node.js:

#### With [npm ton](https://github.com/tonwhales/ton) library:

```ts
import { TonClient, Address } from "ton";
import { getTonCenterV2Endpoint } from "@orbs-network/ton-gateway";

const endpoint = await getTonCenterV2Endpoint(); // get the decentralized RPC endpoint
const client = new TonClient({ endpoint }); // initialize ton library

// make some query to mainnet
const address = Address.parseFriendly("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N").address;
const balance = await client.getBalance(address);
```

#### With [TonWeb](https://github.com/toncenter/tonweb) library:

```js
import TonWeb from "tonweb";
import { getTonCenterV2Endpoint } from "@orbs-network/ton-gateway";

const endpoint = await getTonCenterV2Endpoint(); // get the decentralized RPC endpoint
const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint)); // initialize tonweb library

// make some query to mainnet
const balance = await tonweb.getBalance("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
```
### Using ton-api-v4 Node.js:
```js
import { TonClient4 } from "ton";
import { getTonApiV4Endpoint } from "@orbs-network/ton-gateway";

const endpoint = await getTonApiV4Endpoint();
const client4 = new TonClient4({ endpoint });
let latest = await client4.getLastBlock();
console.log('latest seqno is:',latest.last.seqno);
```

### Using browser script:

```html
<script src="https://cdn.jsdelivr.net/gh/orbs-network/ton-gateway@1.4.0/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/toncenter/tonweb/dist/tonweb.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        TonGateway.getHttpEndpoint().then((endpoint) => { // get the decentralized RPC endpoint
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


## Parameters

### toncenter-V2
```ts
export async function getTonCenterV2Endpoint(network?: Network, suffix?: string): Promise<string> 
```
* `network` - override which TON network do you want to use:
  * `mainnet` - TON mainnet (default)
  * `testnet` - (supported only in toncenter-api-v2) the first TON testnet

* `suffix` - endpoints trailing path suffix, default is `jsonRPC`
  * check toncenter [api v2 docs](https://toncenter.com/api/v2/) eg. `getMasterchainInfo`

### ton-api-V4
```ts
export async function getTonApiV4Endpoint(suffix?: string): Promise<string> 
```
* `suffix` - endpoints trailing path suffix, default is empty string 
  * check toncenter [api v4 docs](https://github.com/orbs-network/ton-api-v4/blob/main/README.md) eg. `/block/latest`

- example:
```ts
  const endpoint = await getTonApiV4Endpoint('/block/latest');
  // returns https://ton.gateway.orbs.network/.../1/mainnet/ton-api-v4/block/latest

  const last = await fetch(endpoint);    
  const json = await last.json();
  console.log('last seqno is:', json.last.seqno);
```

    
&nbsp;  

## Cache & Rate limits:
* The gateway is using [Fastly](https://manage.fastly.com/)cache control
    * request results has 2 seconds TTL
    * there is a rate limit of 10rps over 1 minute  
## Benefits of using the Orbs TON Gateway

1. **No throttling for anonymous users**

    RPC gateways like https://toncenter.com/api/v2/jsonRPC throttle anonymous users to 1 request per second. Most dapps cannot operate under these restrictions since their users are anonymous. The Orbs Network endpoints are designed to serve anonymous dapp users and will not restrict your users from using your dapp client, except the generous rate limit mentioned above.
    
2. **No need for registering an API Key**

    RPC gateways like https://toncenter.com/api/v2/jsonRPC reduce user throttling by requiring you to register an API Key. This API Key cannot be stored client-side since it can be abused (it's supposed to be a secret) and dapps should not run a centralized backend to store this secret since they should be decentralized.

3. **No need to run your own RPC backend**

    If you're building a dapp, your dapp should be decentralized so it can be trustless. If you're running your own centralized backend as part of your dapp, you've made your dapp centralized. If your backend suffers downtime for example, your users will lose access to their funds. If the infrastructure is decentralized, you don't need to worry about it.
    
4. **Decentralized access to the chain**

    By relying on https://toncenter.com/api/v2/jsonRPC, you're relying on a centralized business (toncenter.com), not a protocol. The Orbs Network TON Gateway is a decentralized protocol operated by dozens of [independent nodes](https://status.orbs.network) that are all part of the [Orbs Network](https://github.com/orbs-network). The network mainnet is running since 2019 and validators are staked with Proof-of-Stake consensus with over $100 million TVL locked. The network is extremely robust against downtime due to the number of independent nodes.
