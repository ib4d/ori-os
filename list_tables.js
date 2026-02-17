const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.$queryRaw`
    SELECT table_name, 
           (xpath('/row/cnt/text()', xml_parse(content, 
             (SELECT (xpath('/row/cnt/text()', xml_parse(content, (SELECT query_to_xml(format('SELECT count(*) as cnt FROM %I', table_name), false, true, '')))) )[1]::text::int as cnt
              FROM information_schema.tables 
              WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
             )
           )))[1]::text::int 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  `;

    // Actually, simpler raw query for postgres
    const tables = await prisma.$queryRaw`
    SELECT relname AS table_name, n_live_tup AS row_count
    FROM pg_stat_user_tables
    ORDER BY n_live_tup DESC;
  `;

    console.log('--- Database Table Statistics ---');
    console.log(JSON.stringify(tables, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
