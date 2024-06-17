const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      posts: {
        include: {
          comments: true,
        },
      },
      comments: true,
    },
  });

  console.log('Users:', JSON.stringify(users, null, 2));

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  });

  console.log('Posts:', JSON.stringify(posts, null, 2));

  const comments = await prisma.comment.findMany({
    include: {
      author: true,
      post: true,
    },
  });

  console.log('Comments:', JSON.stringify(comments, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
