import { prisma } from '../src/db/client';
import bcrypt from 'bcrypt';

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);

  await prisma.user.create({
    data: {
      displayName: 'Admin',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
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
