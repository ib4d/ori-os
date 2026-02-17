const http = require('http');

const testEnrichment = (domain) => {
    console.log(`Testing enrichment for ${domain}...`);
    const postData = JSON.stringify({ domain });

    const options = {
        host: '127.0.0.1',
        port: 3001,
        path: '/intelligence/enrich/company',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`BODY: ${data.substring(0, 2000)}`);
        });
    });

    req.on('error', (err) => {
        console.error(`ERROR: ${err.message}`);
    });

    req.write(postData);
    req.end();
};

testEnrichment('google.com');
