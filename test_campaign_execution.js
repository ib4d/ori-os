const http = require('http');

async function request(options, body) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            host: '127.0.0.1',
            port: 3001,
            headers: { 'Content-Type': 'application/json' },
            ...options
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data || '{}') }));
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function testCampaign() {
    console.log('--- Testing Campaign Execution Engine via API ---');

    try {
        // 1. Get a Contact
        const contactsRes = await request({ path: '/crm/contacts', method: 'GET' });
        const contact = contactsRes.body[0];
        if (!contact) throw new Error('No contacts found in DB');

        // 2. Create a Campaign
        const campaignRes = await request({ path: '/engagement/campaigns', method: 'POST' }, {
            name: 'API Test Campaign',
            status: 'RUNNING',
            sequenceSteps: [
                { order: 1, stepType: 'EMAIL', configJson: { subject: 'API Hello' } }
            ]
        });
        const campaign = campaignRes.body;
        console.log(`Created Campaign: ${campaign.id}`);

        // 3. Add Recipient
        await request({ path: `/engagement/campaigns/${campaign.id}/recipients`, method: 'POST' }, {
            contactIds: [contact.id]
        });
        console.log(`Added Recipient: ${contact.email}`);

        console.log('Waiting 15 seconds for background processing...');
        await new Promise(resolve => setTimeout(resolve, 15000));

        // 4. Check API logs or query again (wait, I don't have a GET recipients endpoint yet, let's check one)
        const campaignCheck = await request({ path: `/engagement/campaigns/${campaign.id}`, method: 'GET' });
        console.log('Campaign State:', JSON.stringify(campaignCheck.body, null, 2));

    } catch (error) {
        console.error('Test Error:', error.message);
    }
}

testCampaign();
