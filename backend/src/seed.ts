import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ethara.com' },
    update: {},
    create: {
      email: 'admin@ethara.com',
      name: 'Ethara Admin',
      password: adminPassword,
      role: 'ADMIN',
      bio: 'System Administrator for Ethara Task Manager',
      skills: 'Management, Leadership, Planning',
    },
  });

  const memberPassword = await bcrypt.hash('Member@123', 10);
  const member = await prisma.user.upsert({
    where: { email: 'member@ethara.com' },
    update: {},
    create: {
      email: 'member@ethara.com',
      name: 'Ethara Member',
      password: memberPassword,
      role: 'MEMBER',
      bio: 'Team Member at Ethara',
      skills: 'Development, Design, Marketing',
    },
  });

  console.log({ admin, member });
  console.log('Database seeded successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
