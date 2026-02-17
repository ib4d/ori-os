
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🧪 Testing SeoProjectsService.findAll logic...');
    try {
        const organizationId = 'mock-org-id';
        const projects = await prisma.sEOProject.findMany({
            where: { organizationId },
            include: {
                company: true,
                creator: { select: { id: true, name: true, email: true } },
                _count: {
                    select: {
                        keywords: true,
                        crawls: true,
                        rankings: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        console.log('✅ Success! Projects found:', projects.length);
        if (projects.length > 0) {
            console.log('First project ID:', projects[0].id);
        }
    } catch (error) {
        console.error('❌ Failed to find projects:', error);
    }
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
