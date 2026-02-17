const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Testing manual SEOProject creation...');
    try {
        const project = await prisma.sEOProject.create({
            data: {
                organizationId: 'mock-org-id',
                creatorId: 'mock-user-id',
                name: 'Manual Test',
                domain: 'example.com',
            }
        });
        console.log('✅ Success:', project);
    } catch (e) {
        console.log('❌ FAILED:');
        console.log(e);
    }
}

main().finally(() => prisma.$disconnect());
