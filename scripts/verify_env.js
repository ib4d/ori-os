const fetch = require('node-fetch');
const dotenv = require('dotenv');
const path = require('path');

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function verifyEnv() {
    console.log('--- ORI-OS 2.0 Environment Verification ---');

    // 1. Check API Connectivity
    const apiUrl = process.env.API_URL || 'http://127.0.0.1:3001';
    try {
        const res = await fetch(`${apiUrl}/health`);
        console.log(`✅ API Health: ${res.status === 200 ? 'OK' : 'Error (' + res.status + ')'}`);
    } catch (e) {
        console.log(`❌ API Health: Connection Failed (${apiUrl})`);
    }

    // 2. Check OpenAI Service
    if (process.env.OPENAI_API_KEY) {
        console.log('✅ OpenAI Key: Configured');
    } else {
        console.log('⚠️ OpenAI Key: Missing');
    }

    // 3. Check Sentry
    if (process.env.SENTRY_DSN) {
        console.log('✅ Sentry DSN: Configured');
    } else {
        console.log('⚠️ Sentry DSN: Missing');
    }

    // 4. Check Database URL
    if (process.env.DATABASE_URL) {
        console.log('✅ Database URL: Configured');
    } else {
        console.log('❌ Database URL: Missing');
    }

    // 5. Auth Bypass
    console.log(`ℹ️ Auth Bypass: ${process.env.ORI_AUTH_BYPASS === '1' ? 'Enabled' : 'Disabled'}`);

    console.log('-------------------------------------------');
}

verifyEnv();
