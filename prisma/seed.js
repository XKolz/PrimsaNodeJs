// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetAutoincrement() {
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'User'`;
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'Post'`;
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'Comment'`;
  }

async function main() {
    // clear the data
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});

     // Reset auto-increment counters
  await resetAutoincrement();

  // Check if Alice exists
  const existingAlice = await prisma.user.findUnique({
    where: { email: 'alice@example.com' },
  });

  if (!existingAlice) {
    await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@example.com',
        bio:"I love",
        posts: {
          create: [
            {
              title: 'First Post',
              content: 'This is my first post!',
              comments: {
                create: [
                  {
                    content: 'Nice post!',
                    author: {
                      create: {
                        name: 'Bob',
                        email: 'bob@example.com',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });
    console.log('Seeded Alice with a post and a comment.');
  } else {
    console.log('User with email alice@example.com already exists.');
  }

  // Check if another user and post can be added
  const existingCharlie = await prisma.user.findUnique({
    where: { email: 'charlie@example.com' },
  });

  if (!existingCharlie) {
    await prisma.user.create({
      data: {
        name: 'Charlie',
        email: 'charlie@example.com',
        posts: {
          create: [
            {
              title: 'Charlies First Post',
              content: 'Hello from Charlie!',
              comments: {
                create: [
                  {
                    content: 'Welcome Charlie!',
                    author: {
                      create: {
                        name: 'Dave',
                        email: 'dave@example.com',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });
    console.log('Seeded Charlie with a post and a comment.');
  } else {
    console.log('User with email charlie@example.com already exists.');
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
