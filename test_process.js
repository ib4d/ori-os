const http = require('http');

const options = {
    host: '127.0.0.1',
    port: 3001,
    path: '/engagement/campaigns/process',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log(`RESPONSE: ${data}`);
    });
});

req.on('error', (err) => {
    console.error(`ERROR: ${err.message}`);
});

req.end();
