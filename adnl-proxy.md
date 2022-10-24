# adnl-proxy options

# option 1 - explicit lite-server
```javascript
let config: Config = {
    protocol: "adnl-proxy"    
};
// default - returns list of lite servers orbs host - benefits from fastly multiple node/proxy instance 
let liteServers = await gateway.getWsLiteServers(/*default orbs liteservers list*/);

// bring youw own list
liteServers = await gateway.getWsLiteServers('https://ton-blockchain.github.io/global.config.json');

// return array of host and pubkey e.g
// [
//     {
//         "ip": 84478511,
//         "port": 19949,
//         "id": {
//             "@type": "pub.ed25519",
//             "key": "n4VDnSCUuSpjnCyUk9e3QOOd6o0ItSWYbTnW3Wnn8wk="    
//         }
//     },
//     {
//         "ip": 84478479,
//         "port": 48014,
//         "id": {
//             "@type": "pub.ed25519",
//             "key": "3XO67K/qi+gu3T9v8G2hx1yNmWZhccL3O7SoosFo8G0="    
//         }
//     },
//     {
//         "ip": -2018135749,
//         "port": 53312,
//         "id": {
//             "@type": "pub.ed25519",
//             "key": "aF91CuUHuuOv9rm2W5+O/4h38M3sRm40DtSdRxQhmtQ="
//         }
//     }
// ]

//const data = IS_TESTNET ? networkConfig.testnetConfig : networkConfig.mainnetConfig

const engines: LiteSingleEngine[] = []
  // while (engines.length < 50) {
  //const ls = data.liteservers[Math.floor(Math.random() * data.liteservers.length)]
  
for ( let ls of liteServers){
  engines.push(
    const pubkey = encodeURIComponent(ls.id.key)
    new LiteSingleEngine({
      host: `wss://ws.tonlens.com/?ip=${ls.ip}&port=${ls.port}&pubkey=${pubkey}`,      
      publicKey: Buffer.from(ls.id.key, 'base64'),
    })
  )
}

const engine = new LiteRoundRobinEngine(engines)
const liteClient = new LiteClient({ engine })

endWait(client)
  

// why don't we wrap all liteClient initialization and get married with ton-lite-client?
const adnlLiteClient = await gateway.createADNLLiteClient();
await liteClient.getMasterchainInfo()

```

# raw HTML

```HTML
<script type="text/javascript">
        const socket = new WebSocket('ws://localhost:8080?ip=84478511&port=19949&pubkey=n4VDnSCUuSpjnCyUk9e3QOOd6o0ItSWYbTnW3Wnn8wk%3D');

        // Connection opened
        socket.addEventListener('open', (event) => {
            const TL_GETTIME = '7af98bb435263e6c95d6fecb497dfd0aa5f031e7d412986b5ce720496db512052e8f2d100cdf068c7904345aad16000000000000';
            socket.send(TL_GETTIME);
        });

        // Listen for messages
        socket.addEventListener('message', (event) => {
            console.log('Message from server ', event.data);
        });

        socket.onmessage = (ev) => {
            console.log(ev);
        };

        // close
        socket.addEventListener('close', (event) => {
            console.log('closed ', event.data);
        });


    </script>
```