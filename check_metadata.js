const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const competitors = await prisma.sEOCompetitor.findMany({
        where: { domain: 'https://example.com' }
    });

    if (competitors.length === 0) {
        console.log('❌ No competitor found for https://example.com');
    } else {
        const comp = competitors[0];
        console.log('✅ Competitor found');
        console.log('Last Crawled At:', comp.lastCrawledAt);
        console.log('Metadata:', JSON.stringify(comp.metadata, null, 2));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
