import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing live Neon PostgreSQL connection...');

  const categoryCount = await prisma.hubCategory.count();
  const serviceCount = await prisma.hubService.count();
  const sampleCategories = await prisma.hubCategory.findMany({
    take: 5,
    select: { name: true, slug: true }
  });
  const sampleServices = await prisma.hubService.findMany({
    take: 5,
    select: { name: true, category_id: true }
  });

  console.log('--- NEON DATABASE LIVE VERIFICATION ---');
  console.log(`Total Categories in Neon DB: ${categoryCount}`);
  console.log(`Total Services in Neon DB: ${serviceCount}`);
  console.log('Sample Categories in Neon DB:', sampleCategories);
  console.log('Sample Services in Neon DB:', sampleServices);
}

main()
  .catch((e) => {
    console.error('Neon DB Connection Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
