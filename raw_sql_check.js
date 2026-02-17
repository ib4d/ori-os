const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const competitorCount = await prisma.$queryRaw`SELECT count(*) FROM seo_competitors`;
    const alertCount = await prisma.$queryRaw`SELECT count(*) FROM seo_alerts`;
    const projectCount = await prisma.$queryRaw`SELECT count(*) FROM seo_projects`;

    console.log('--- Raw SQl Counts ---');
    console.log('Projects:', projectCount);
    console.log('Competitors:', competitorCount);
    console.log('Alerts:', alertCount);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
