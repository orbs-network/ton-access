# ton-rpc-gw (gateway)
Client side gateway to access Ton RPC protocols by IP randomly or round robin

## Install
```
npm install @orbs-network/ton-rpc-gw
```

## Get Started
```js
const client = import "@orbs-network/ton-rpc-gw"

async function start(){
    nodes =  new Client();
    await  client.init();
    // get a live ton node IP
    const node = client.getRandomNode();
    // get nodes status
    const url = 'http://'+node.Ip+'/services/management-service/status';
    const response = await axios.get(url);
    console.log(`${node.Name} status`)
    console.log(response);
}
```

## API

### Node (type)
```JSON
{
    "EthAddress": "0874bc1383958e2475df73dc68c4f09658e23777",
    "OrbsAddress": "067a8afdc6d7bafa0ccaa5bb2da867f454a34dfa",
    "Ip": "46.101.165.46",
    "Port": 0,
    "Name": "Wings Stiftung"
}
```

### init
```JS
// optional array of seed HostNames of nodes
// if node provided- a hard coded array is used
const seed = [
    '54.95.108.148',
    '0xcore.orbs.network'
];
client.init(seed);
```

> TODO: init with infura to get the committee from ethereum network
### getRandomNode
```JS
// select weather to get any node or only a node from orbs 21 node committee
const committeeOnly = true;
// use random index to select the node.
const node = client.getRandomNode(committeeOnly)
```

### getNextNode
```JS
// select weather to get any node or only a node from orbs 21 node committee
const committeeOnly = false;
// uses round robin to fetch next node
const node = client.getNextNode(committeeOnly)
```

> Please notice the health of the node is checked every 10 minutes. Its the user's responsibility to call another node upon a failure.

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
        <h2 id="title">Orbs Network Topology</h2>
        <div id="ton-nodes">
        </div>
        <script type="text/javascript" src="../dist/index.min.js"></script>
        <script type="text/javascript">
            // onLoad
            document.addEventListener('DOMContentLoaded', function () {
                // init orbs client
                window.orbsClient.init().then(() => {
                    // get container
                    let tonNodes = document.getElementById("ton-nodes");
                    // enum ton-nodes
                    for (let i = 0; i < 22; ++i) {
                        let node = window.orbsClient.getNextNode();
                        // append element
                        let code = document.createElement("code");
                        code.innerHTML = JSON.stringify(node, null, 2);
                        let div = document.createElement("div");
                        div.appendChild(code)
                        tonNodes.appendChild(div);
                    }
                });
            }, false);
        </script>
</body>

</html>
```