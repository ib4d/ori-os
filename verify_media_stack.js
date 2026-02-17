const axios = require('axios');

async function verifyMediaStack() {
    const API_URL = 'http://localhost:3001';
    console.log('🧪 Starting Media Stack Verification...');

    try {
        // 1. Create a LOCAL storage connector
        console.log('1. Creating LOCAL storage connector...');
        const connectorRes = await axios.post(`${API_URL}/connectors`, {
            type: 'LOCAL',
            label: 'Local Storage',
            config: { baseDir: 'uploads' },
        });
        console.log(`✅ Connector created: ${connectorRes.data.id}`);

        // 2. Test that connector exists
        console.log('2. Verifying connector...');
        const listRes = await axios.get(`${API_URL}/connectors`);
        console.log(`✅ Found ${listRes.data.length} connectors`);

        console.log('✨ Media Stack basic verification completed!');
        console.log('Note: File upload requires multipart/form-data which needs proper testing setup.');
    } catch (error) {
        console.error('❌ Verification failed:', error.response?.data || error.message);
    }
}

verifyMediaStack();
