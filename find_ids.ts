import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst();
    const org = await prisma.organization.findFirst();

    console.log('Valid IDs found:');
    console.log('USER_ID:', user?.id);
    console.log('ORG_ID:', org?.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
