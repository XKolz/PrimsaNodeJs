const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const newUserAndPost = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({
      data: {
        name: 'Eve',
        email: 'eve@example.com',
      },
    });

    const post = await prisma.post.create({
      data: {
        title: 'Eve’s First Post',
        content: 'Hello, this is Eve!',
        authorId: user.id,
      },
    });

    return { user, post };
  });

  console.log('Created user and post in a transaction:', newUserAndPost);
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
