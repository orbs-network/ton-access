import { expect } from 'chai';
import { getHttpEndpoint, Config } from '../src/index';

describe('Infra', function () {
    this.timeout(30000);
    // mainnet
    it('should return relevant number per each nodes weight', async () => {
        let counter: any = {};
        const config: Config = {
            network: 'mainnet'
        }
        const SUM = 100;
        for (let i = 0; i < SUM; ++i) {
            const res = await getHttpEndpoint(config);
            if (!counter[res])
                counter[res] = 0;

            counter[res] += 1;
        }

        let mean = Math.round(SUM / Object.keys(counter).length);

        console.log('sum', SUM);
        console.log('mean', mean);
        console.log(counter);
        expect(mean).to.be.below(SUM / 2);

        // check load balancing is working and some get few traffic
        // for (let id in counter) {
        //     const div = counter[id] / mean;

        //     expect(div).to.be.below(2);
        // }
    });
});