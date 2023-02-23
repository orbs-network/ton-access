
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