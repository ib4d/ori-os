const axios = require('axios');

async function verifyEmailStack() {
    const API_URL = 'http://localhost:3001';
    console.log('🧪 Starting Email Stack Verification...');

    try {
        // 1. Create a RESEND connector with INVALID key
        console.log('1. Creating RESEND connector (invalid key)...');
        const resendRes = await axios.post(`${API_URL}/connectors`, {
            type: 'RESEND',
            label: 'Resend Primary',
            config: { apiKey: 're_fake_key_123' },
        });
        console.log(`✅ Resend connector created: ${resendRes.data.id}`);

        // 2. Create a SENDGRID connector with INVALID key
        console.log('2. Creating SENDGRID connector (invalid key)...');
        const sgRes = await axios.post(`${API_URL}/connectors`, {
            type: 'SENDGRID',
            label: 'SendGrid Fallback',
            config: { apiKey: 'SG.fake_key_456' },
        });
        console.log(`✅ SendGrid connector created: ${sgRes.data.id}`);

        // 3. Trigger test email send
        console.log('3. Triggering test email send (expecting fallback flow)...');
        const emailRes = await axios.post(`${API_URL}/connectors/email/send-test`, {
            to: 'test@example.com',
            subject: 'Fallback Test',
            html: '<p>Testing the fallback logic</p>'
        });

        console.log('Result:', JSON.stringify(emailRes.data, null, 2));

        if (emailRes.data.status === 'failed' && emailRes.data.error === 'All email providers failed') {
            console.log('✅ Fallback logic verified: Both providers were tried and failed.');
        } else {
            console.log('⚠️ Unexpected result. Check server logs to see if providers were actually tried.');
        }

        console.log('✨ Email Stack Verification completed!');
    } catch (error) {
        console.error('❌ Verification failed:', error.response?.data || error.message);
    }
}

verifyEmailStack();
