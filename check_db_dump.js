const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const projectCount = await prisma.sEOProject.count();
    const competitorCount = await prisma.sEOCompetitor.count();
    const alertCount = await prisma.sEOAlert.count();

    console.log(`Summary Counts: Projects: ${projectCount}, Competitors: ${competitorCount}, Alerts: ${alertCount}`);

    const projects = await prisma.sEOProject.findMany({});
    console.log('--- Projects ---');
    console.log(JSON.stringify(projects, null, 2));

    const competitors = await prisma.sEOCompetitor.findMany({});
    console.log('\n--- Competitors ---');
    console.log(JSON.stringify(competitors, null, 2));

    const alerts = await prisma.sEOAlert.findMany({
        orderBy: { createdAt: 'desc' }
    });
    console.log('\n--- Alerts ---');
    console.log(JSON.stringify(alerts, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
