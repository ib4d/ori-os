const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const orgId = 'mock-org-id';
    const userId = 'mock-user-id';
    const projectId = 'test-project-id';

    console.log('🌱 Seeding SEO verification data...');

    // 1. Create Organization
    const org = await prisma.organization.upsert({
        where: { id: orgId },
        update: {},
        create: {
            id: orgId,
            name: 'Test Org',
            slug: 'test-org-' + Date.now(),
        },
    });
    console.log('✅ Org created');

    // 2. Create User
    const user = await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: 'test@example.com',
            name: 'Test User',
        },
    });
    console.log('✅ User created');

    // 3. Create Project
    const project = await prisma.sEOProject.upsert({
        where: { id: projectId },
        update: {},
        create: {
            id: projectId,
            organizationId: orgId,
            creatorId: userId,
            name: 'Test Project',
            domain: 'https://example.com',
        },
    });
    console.log('✅ Project created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
