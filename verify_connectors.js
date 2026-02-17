const axios = require('axios');

async function testConnectors() {
    const API_URL = 'http://localhost:3001';
    const orgId = 'mock-org-id';
    const userId = 'mock-user-id';

    console.log('🧪 Starting API-based Connectors Verification...');

    try {
        // 1. Create a connector
        console.log('1. Creating SENDGRID connector...');
        const createRes = await axios.post(`${API_URL}/connectors`, {
            type: 'SENDGRID',
            label: 'Main Email',
            config: { apiKey: 'SG.api-verification-test-123' },
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        const connector = createRes.data;
        console.log(`✅ Connector created with ID: ${connector.id}`);

        // 2. Find all
        console.log('2. Finding all connectors...');
        const listRes = await axios.get(`${API_URL}/connectors`);
        console.log(`✅ Found ${listRes.data.length} connectors`);

        // 3. Find one and verify decryption
        console.log('3. Verifying decryption via findOne...');
        const findRes = await axios.get(`${API_URL}/connectors/${connector.id}`);
        if (findRes.data.config.apiKey === 'SG.api-verification-test-123') {
            console.log('✅ Decryption successful: API key matches');
        } else {
            throw new Error(`❌ Decryption failed: Expected SG.api-verification-test-123, got ${findRes.data.config.apiKey}`);
        }

        // 4. Update
        console.log('4. Updating connector label...');
        await axios.patch(`${API_URL}/connectors/${connector.id}`, {
            label: 'Production Email'
        });
        const updatedRes = await axios.get(`${API_URL}/connectors/${connector.id}`);
        if (updatedRes.data.label === 'Production Email') {
            console.log('✅ Update successful');
        } else {
            throw new Error('❌ Update failed');
        }

        // 5. Test connection
        console.log('5. Testing connection endpoint...');
        const testRes = await axios.post(`${API_URL}/connectors/${connector.id}/test`);
        if (testRes.data === true) {
            console.log('✅ Connection test successful');
        } else {
            throw new Error('❌ Connection test failed');
        }

        console.log('✨ All API tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testConnectors();
