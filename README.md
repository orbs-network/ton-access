# ton-gateway
Client side gateway to access Ton RPC protocols by IP, randomly or round robin on a set of serving nodes.

## Install
```
npm install @orbs-network/ton-gateway
```

## get started

https://github.com/tonwhales/ton:

```js
import { TonClient } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-gateway";

const endpoint = await getHttpEndpoint();
const client = new TonClient({ endpoint });
```
https://github.com/toncenter/tonweb:
```js
import TonWeb from "tonweb";
import { getHttpEndpoint } from "@orbs-network/ton-gateway";

const endpoint = await getHttpEndpoint();
const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));
```
## config
```js
interface Config {
  version?: number // default: 1
  network?: "mainnet" | "testnet" | "sandbox" // default: mainnet
  protocol?: "toncenter-api-v2" | "ton-api-v4" | "adnl-proxy" // default: toncenter-api-v2
  host?: string // default: "ton.gateway.orbs.network"
};
```
- ```version``` ton-rpc protocol version - currently ```1```
- ```network``` supported ton network
- ```protocol``` ton protocol such as toncenter-http
- ```host``` do not set, default is used ton.gateway.orbs.network


- example get testnet endpoint with config
```js
import { getHttpEndpoint, Config } from "@orbs-network/ton-gateway";
const config:Config = {
    network:"testnet"
}
const endpoint = await getHttpEndpoint(config);
```

## gateway object
- you may work directly with the gateway object in order to get several endpoints in a round-robin or a random manner.

### instantiate and initialize
```JS
// optional array of seed HostNames of nodes
// if node provided- a hard coded array is used
import { Gateway, Config } from "@orbs-network/ton-gateway"
const config: Config = {
    urlVersion: 1,
    network: "sandbox",
    protocol: "toncenter-api-v2"
};  

const gateway = new Gateway(config);
await gateway.init();
```
- ```init``` is async so the list of nodes are fetched from remote source.
### getNextNodeUrl
- endpoint suffix ```getMasterchainInfo``` is optional
```js
url0 = gateway.getNextNodeUrl("getMasterchainInfo");
url1 = gateway.getNextNodeUrl("getMasterchainInfo");
const response = await axios.get(url0);    
console.log(response);
```
- get all nodes urls in a round-robin manner. 
### getRandNodeUrl
- Assembles a url from config parameters and any random backend node and suffix provided for endpoint
```JS
// use random index to select the node.
const node = gateway.getRandNodeUrl("getMasterchainInfo")
```
 - returns endpoint to a random node

## webpage example

```html
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello Typescript</title>
</head>

<body>
    <div name="container">
        <h2 id="title">Ton Gateway URLs</h2>
        <div id="ton-urls">
        </div>
        <script type="text/javascript" src="../dist/index.min.js"></script>
        <script type="text/javascript">
            // onLoad
            document.addEventListener('DOMContentLoaded', function () {
                // init ton gateway                
                let config = {
                    urlVersion: 1,
                    network: "mainnet",
                    protocol: "toncenter"
                };

                let gateway = new window.tonGateway(config);
                gateway.init().then(() => {
                    // get container
                    let tonUrls = document.getElementById("ton-urls");

                    // enum ton-urls
                    let url
                    for (let i = 0; i < 10; ++i) {
                        url = gateway.getNextNodeUrl("getMasterchainInfo");
                        // append element
                        let code = document.createElement("code");
                        code.innerHTML = url;
                        let div = document.createElement("div");
                        div.appendChild(code)
                        tonUrls.appendChild(div);
                    }
                    fetch(url).then((res) => {
                        console.log(res);
                    });
                });
            }, false);
        </script>
</body>
</html>
```