import { Client, Config } from '../src/index';

let config: Config = {
  urlVersion: 1,
  network: "mainnet",
  protocol: "toncenter"
};

const node1Name = '2000000000000000000000000000000000000002'
const node2Name = '3000000000000000000000000000000000000003'

test('Create', async () => {
  const tonGateway = new Client(config);
  expect(tonGateway).toBeDefined();
  await tonGateway.init();
  // sanity
  const url1 = tonGateway.getNextNodeUrl("getMasterChainInfo");
  const url2 = tonGateway.getNextNodeUrl("getMasterChainInfo");
  const expect1 = `https://ton.gateway.orbs.network/${node1Name}/1/mainnet/toncenter/getMasterChainInfo`;
  const expect2 = `https://ton.gateway.orbs.network/${node2Name}/1/mainnet/toncenter/getMasterChainInfo`;
  expect(url1).toBe(expect1);
  expect(url2).toBe(expect2)
  // back to first ur amongst two
  const url3 = tonGateway.getNextNodeUrl("getMasterChainInfo");
  expect(url3).toBe(expect1);
  // check out of 20 randoms, there a change
  const s = new Set<string>;
  for (let i = 0; i < 20; ++i) {
    s.add(tonGateway.getRandNodeUrl("getMasterChainInfo"));
  }
  expect(s.size).toBe(2);
});

// test('Next', async () => {
//   const tonGateway = create();
//   expect(tonGateway).toBeDefined();
//   await tonGateway.init();
//   let next;
//   next = tonGateway.getNextNode();
//   expect(tonGateway.nodeIndex).toBe(0);
//   next = tonGateway.getNextNode();
//   expect(tonGateway.nodeIndex).toBe(1);
//   next = tonGateway.getNextNode();
//   expect(tonGateway.nodeIndex).toBe(2);
// });

//https://ton.gateway.orbs.network/2000000000000000000000000000000000000002/1/mainnet/toncenter/getMasterchainInfo