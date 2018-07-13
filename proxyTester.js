const request               =               require('request');
/**
* @param {Array} proxyArray - An Array of the proxies to be tested
* @param {string} proxy - The Proxy that is going to be tested
*/

class testProxy {
    constructor(proxy, endpoint) {
        this.proxyHost = proxy.split(':')[0];
        this.proxyPort = proxy.split(':')[1];
        this.proxyUser = proxy.split(':')[2];
        this.proxyPass = proxy.split(':')[3];
        this.endpoint = endpoint;
    };

    configureProxy() {
        let proxyFormat = `http://${this.proxyUser}:${this.proxyPass}@${this.proxyHost}:${this.proxyPort}`;
        return proxyFormat;
    };

    get getProxyLatency() {
        return new Promise(resolve => {
            let proxyToTest = this.configureProxy();

            var proxiedRequest = request.defaults({proxy: proxyToTest});

            let timeBeforeReq = Date.now();

            proxiedRequest.get(this.endpoint, (err, resp, body) => {
                if (err) throw err;

                let timeAfterReq = Date.now();
                let proxyLatency = timeAfterReq - timeBeforeReq;
                resolve(proxyLatency)
            });
        })
        
    };

    get testSingleProxyStatus() {
        return new Promise(resolve => {
            let proxyToTest = this.configureProxy();

            var proxiedRequest = request.defaults({proxy: proxyToTest});

            proxiedRequest.get(this.endpoint, (err, resp, body) => {
                if (err) throw err;

                resolve(resp.statusCode)
            });
        })
    };

};

function defineStatus (statusCode) {

if (statusCode == 200) {
    let fontColor = 'green';
    let proxyStat = 'Good';

    return [fontColor, proxyStat];
};

if (statusCode == 307 || statusCode == 308) {
    let fontColor = 'orange';
    let proxyStat = 'Re-Directed';

    return [fontColor, proxyStat];
};

if (statusCode == 400) {
    let fontColor = 'red';
    let proxyStat = 'Dead';

    return [fontColor, proxyStat];
};

if (statusCode == 401) {
    let fontColor = 'red';
    let proxyStat = 'UnAuthorized';

    return [fontColor, proxyStat];
};

if (statusCode == 403) {
    let fontColor = 'red';
    let proxyStat = 'Banned'

    return [fontColor, proxyStat];
}

if (statusCode == 500) {
    let fontColor = 'red';
    let proxyStat = 'API Error';

    return [fontColor, proxyStat];
};

};


const runTester = () => {

let proxyArray = [] // Enter Proxies Here

let endpoint = ''//Enter URL Endpoint

console.log(`\nTesting ${proxyArray.length} Proxies on URL ${endpoint}\n\n`);

    proxyArray.forEach(async (proxy) => {
        let proxyTester = new testProxy(proxy, endpoint);

        
        let proxyStatusCode = await proxyTester.testSingleProxyStatus
        
        let proxyStatus = defineStatus(proxyStatusCode);

        let proxySpeed = await proxyTester.getProxyLatency;

        console.log(`Proxy : ${proxy}`);
        
        console.log(`Stauts Code : ${proxyStatusCode}`);
        
        let logRes = proxyStatus[1];
        console.log(`Proxy Status : ${logRes}`)

        console.log(`Proxy Speed : ${proxySpeed}\n`)
    });
};

runTester();
