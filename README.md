# ton-rpc-gw (gateway)
Client side gateway to access Ton RPC protocols by IP randomly or round robin

## Install
```
npm install @orbs-network/ton-rpc-gw
```

## Get Started
```js
import { Client, Config } from "@orbs-network/ton-rpc-gw"

async function start(){        
    const config: Config = {
        urlVersion: 1,
        network: "mainnet",
        protocol: "toncenter"
    };  
    const client = new Client(config);
    await client.init();
    let url;
    url = client.getNextNodeUrl("getMasterchainInfo");
    url = client.getRandNodeUrl("getMasterchainInfo");
    const response = await axios.get(url);    
    console.log(response);
}
```

### Config (type)
```js
export interface Config {  
  urlVersion: number,
  network: "mainnet" | "testnet" | "sandbox",
  protocol: "toncenter",
  host?: string,
}
```
- ```urlVersion``` ton-rpc protocol version - currently ```1```
- ```network``` supported ton network
- ```protocol``` ton protocol such as toncenter-http
- ```host``` do not set, default is used ton.gateway.orbs.network

### init
```JS
// optional array of seed HostNames of nodes
// if node provided- a hard coded array is used

await client.init(seed);
```


### getRandNodeUrl
Assembles a url from config parameters and any random backend node and suffix provided for endpoint
```JS
// use random index to select the node.
const node = client.getRandNodeUrl("suffixEndPoint")
```
 - committeeOnly is optional - for future use

### getNextNodeUrl
Assembles a url from config parameters and any next backend node and suffix provided for endpoint
```JS

// uses round robin to fetch next node
const node = client.getNextNodeUrl(committeeOnly)
```
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
                // init orbs client                
                let config = {
                    urlVersion: 1,
                    network: "mainnet",
                    protocol: "toncenter"
                };

                let client = new window.tonGateway(config);
                client.init().then(() => {
                    // get container
                    let tonUrls = document.getElementById("ton-urls");

                    // enum ton-urls
                    for (let i = 0; i < 10; ++i) {
                        let url = client.getNextNodeUrl("getMasterchainInfo");
                        // append element
                        let code = document.createElement("code");
                        code.innerHTML = url;
                        let div = document.createElement("div");
                        div.appendChild(code)
                        tonUrls.appendChild(div);
                    }
                });
            }, false);
        </script>
</body>
</html>
```