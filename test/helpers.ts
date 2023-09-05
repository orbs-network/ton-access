export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function getJson(url: string) {
    const settings = { method: "Get" };
    const res = await fetch(url, settings);
    return await res.json();
}
async function sanityEndpoint(endpoint: string) {
    const jsn = await getJson(endpoint);
    jsn.url = endpoint;
    return jsn;
}
export async function sanity(endpoints: Array<string>, suffix: string) {
    // mainnet all nodes         
    let calls: Array<Promise<any>> = [];
    for (let endpoint of endpoints) {
        endpoint += suffix;
        calls.push(sanityEndpoint(endpoint))
    }
    return await Promise.all(calls);
}

export async function multiPostCallsBatch(batchSize: number, endpoint: string, body: any) {
    let calls: any[] = [];
    for (let i = 0; i < batchSize; ++i) {
        calls.push(fetch(endpoint, {
            method: 'POST',
            //mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }));
    }
    console.log(`performing ${batchSize} calls at once...`)
    const responses = await Promise.all(calls);
    console.log(`DONE!`)

    return responses;
}
export async function multiPostCalls(n: number, endpoint: string) {
    const body = { "id": "1", "jsonrpc": "2.0", "method": "runGetMethod", "params": { "address": "0:f4f590eb7d85d4f8778afa1771c0f43772304e22c7ec194072ca9fd220368f5c", "method": "get_jetton_data", "stack": [] } };
    const BATCH_SIZE = 50;
    let responses: any[] = [];
    for (let i = 0; i < n; i += BATCH_SIZE) {
        const batchResps = await multiPostCallsBatch(BATCH_SIZE, endpoint, body)
        responses = responses.concat(batchResps);
    }

    // summarize
    const count: { [key: number]: number } = {};
    const cache: { [key: string]: number } = {};
    for (const r of responses) {
        if (!count[r.status])
            count[r.status] = 0;
        count[r.status] += 1;
        if (r.status == 200) {
            const xc = r.headers.get('X-Cache');
            if (!cache[xc]) {
                cache[xc] = 0;
            }
            cache[xc] += 1;
        }
    }
    return {
        status: count,
        cache: cache
    }
}