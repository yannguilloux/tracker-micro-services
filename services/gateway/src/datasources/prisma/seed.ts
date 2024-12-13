import 'dotenv/config';
import { faker } from '@faker-js/faker';
import debug from 'debug';
import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

const debugLog = debug('prisma:seed');

const WEBSITE_COUNT = parseInt(process.env.WEBSITE_COUNT!, 10) || 100;
const LINK_COUNT = parseInt(process.env.LINK_COUNT!, 10) || 1000;
const USER_COUNT = parseInt(process.env.USER_COUNT!, 10) || 100000;

debugLog('Connected to PostgreSQL');

try {
  /* Reset tables */
  await prisma.$queryRaw`TRUNCATE TABLE "Website", "Link", "Visitor" RESTART IDENTITY CASCADE`;

  /* Fake websites */
  const websites: Prisma.WebsiteCreateManyInput[] = Array.from(
    { length: WEBSITE_COUNT },
    () => ({
      name: faker.internet.domainName(),
      url: faker.internet.url(),
      email: faker.internet.email(),
    }),
  );

  const websiteRows = await prisma.website.createManyAndReturn({
    data: websites,
  });

  debugLog(`Inserted ${websiteRows.length} websites`);

  /* Fake links */
  let i = 1;
  const links: Prisma.LinkCreateManyInput[] = Array.from(
    { length: LINK_COUNT },
    () => ({
      label: `Link_${i++}`,
      url: faker.internet.url(),
      websiteId: faker.helpers.arrayElement(websiteRows).id,
    }),
  );

  const linkResult = await prisma.link.createMany({ data: links });

  debugLog(`Inserted ${linkResult.count} links`);

  /* Fake visitors */
  const visitors: Prisma.VisitorCreateManyInput[] = Array.from(
    { length: USER_COUNT },
    () => ({
      uuid: faker.string.uuid(),
    }),
  );

  const visitorResult = await prisma.visitor.createMany({ data: visitors });

  debugLog(`Inserted ${visitorResult.count} visitors`);
} catch (error) {
  console.error('Error seeding database', error);
} finally {
  await prisma.$disconnect();
}
