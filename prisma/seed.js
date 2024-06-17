// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetSequences() {
    // Reset the sequence for the User table
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max("id"), 0) + 1, false) FROM "User"`;
    // Reset the sequence for the Post table
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Post"', 'id'), coalesce(max("id"), 0) + 1, false) FROM "Post"`;
    // Reset the sequence for the Comment table
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Comment"', 'id'), coalesce(max("id"), 0) + 1, false) FROM "Comment"`;
  }

async function main() {
    // clear the data
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});
    
      // Reset the sequences
  await resetSequences();

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
