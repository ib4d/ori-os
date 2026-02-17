const axios = require('axios');

async function verifyAIStack() {
    const API_URL = 'http://localhost:3001';
    console.log('🧪 Starting AI Stack Verification...');

    try {
        // 1. Create an OPENAI connector (with fake key for testing infrastructure)
        console.log('1. Creating OPENAI connector...');
        const openaiRes = await axios.post(`${API_URL}/connectors`, {
            type: 'OPENAI',
            label: 'OpenAI GPT',
            config: { apiKey: 'sk-fake-key-for-testing' },
        });
        console.log(`✅ OpenAI connector created: ${openaiRes.data.id}`);

        // 2. Create an ANTHROPIC connector (with fake key for testing infrastructure)
        console.log('2. Creating ANTHROPIC connector...');
        const anthropicRes = await axios.post(`${API_URL}/connectors`, {
            type: 'ANTHROPIC',
            label: 'Claude AI',
            config: { apiKey: 'sk-ant-fake-key-for-testing' },
        });
        console.log(`✅ Anthropic connector created: ${anthropicRes.data.id}`);

        // 3. Verify connectors exist
        console.log('3. Verifying AI connectors...');
        const listRes = await axios.get(`${API_URL}/connectors`);
        const aiConnectors = listRes.data.filter(c =>
            ['OPENAI', 'ANTHROPIC'].includes(c.type.toUpperCase())
        );
        console.log(`✅ Found ${aiConnectors.length} AI connectors`);

        console.log('✨ AI Stack infrastructure verification completed!');
        console.log('Note: Actual text generation requires valid API keys.');
    } catch (error) {
        console.error('❌ Verification failed:', error.response?.data || error.message);
    }
}

verifyAIStack();
