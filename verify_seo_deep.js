const axios = require('axios');

async function verifySeoDeep() {
    console.log('🧪 Starting Deep SEO Verification...');

    const BASE_URL = 'http://localhost:3001/seo/projects';
    const TEST_DOMAIN = 'google.com';
    const USER_ID = 'mock-user-id';
    const ORG_ID = 'mock-org-id';
    let projectId;

    try {
        // 1. Create a Test Project if needed
        console.log('\n1. Creating/Finding test project...');
        const projectsRes = await axios.get(BASE_URL);
        const projects = projectsRes.data;

        let project = projects.find(p => p.domain === TEST_DOMAIN);
        if (!project) {
            const createRes = await axios.post(BASE_URL, {
                name: 'Deep Test Project',
                domain: TEST_DOMAIN,
            });
            project = createRes.data;
        }
        projectId = project.id;
        console.log(`Using Project ID: ${projectId}`);

        // 2. Test Real Crawler
        console.log('\n2. Triggering real site crawl (max 2 pages)...');
        const crawlRes = await axios.post(`${BASE_URL}/${projectId}/crawl`, {
            maxPages: 2
        });
        const crawl = crawlRes.data;
        console.log(`Crawl triggered. ID: ${crawl.id}. Status: ${crawl.status}`);

        // Wait a bit for the worker to pick it up (simplified - we assume it works if status updates)
        await new Promise(r => setTimeout(r, 5000));
        const crawlStatusRes = await axios.get(`${BASE_URL}/${projectId}/crawl/${crawl.id}`);
        console.log(`Current Crawl Status: ${crawlStatusRes.data.status}`);

        // 3. Test Content Analysis Scraping
        console.log(`\n3. Testing real content analysis for "https://${TEST_DOMAIN}"...`);
        const analysisRes = await axios.post(`${BASE_URL}/${projectId}/content/analyze`, {
            pageUrl: `https://${TEST_DOMAIN}`,
            targetKeyword: 'search',
            includeCompetitors: false
        });
        const analysis = analysisRes.data;
        console.log(`Analysis Score: ${analysis.score}`);
        console.log(`Word Count: ${analysis.yourPage.wordCount}`);
        console.log(`Keyword In Title: ${analysis.yourPage.keywordInTitle}`);

        // 4. Test Backlink Verification
        console.log('\n4. Testing backlink verification...');
        // Add a backlink we KNOW exists (Google homepage linking to itself or similar)
        // Actually let's just add any link and see it verify
        const blRes = await axios.post(`${BASE_URL}/${projectId}/backlinks`, {
            sourceUrl: `https://www.google.com`,
            targetUrl: `https://www.google.com/search`,
            anchorText: 'Search',
            linkType: 'dofollow'
        });
        const backlink = blRes.data;
        console.log(`Added Backlink ID: ${backlink.id}`);

        const verifyRes = await axios.post(`${BASE_URL}/${projectId}/backlinks/${backlink.id}/verify`);
        console.log(`Verification Result: ${verifyRes.data.status} (Found: ${verifyRes.data.found})`);

        console.log('\n✅ Deep SEO Verification Completed.');

    } catch (error) {
        console.error('❌ Verification failed:', error.response?.status, JSON.stringify(error.response?.data, null, 2) || error.message);
    }
}

verifySeoDeep();
