
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking DB state ---');
    const user = await prisma.user.findUnique({ where: { id: 'mock-user-id' } });
    console.log('mock-user-id exists:', !!user);

    const org = await prisma.organization.findUnique({ where: { id: 'mock-org-id' } });
    console.log('mock-org-id exists:', !!org);

    if (!user || !org) {
        console.log('\nSetting up missing mock data...');
        if (!org) {
            await prisma.organization.upsert({
                where: { id: 'mock-org-id' },
                update: {},
                create: { id: 'mock-org-id', name: 'Mock Organization' }
            });
            console.log('Ensured mock-org-id');
        }
        if (!user) {
            await prisma.user.upsert({
                where: { id: 'mock-user-id' },
                update: {},
                create: { id: 'mock-user-id', email: 'admin@oricraftlabs.com', name: 'Mock Admin' }
            });
            console.log('Ensured mock-user-id');
        }
    }
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
