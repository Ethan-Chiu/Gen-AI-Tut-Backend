import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await createUsers();
}

async function createUsers() {
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        name: 'User ' + i,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
