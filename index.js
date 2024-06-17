
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Fetch all posts with their comments and authors
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
  console.log('All posts with comments and authors:', JSON.stringify(posts, null, 2));

  // Fetch a specific user with their posts and comments
  const user = await prisma.user.findUnique({
    where: {
      email: 'alice@example.com',
    },
    include: {
      posts: {
        include: {
          comments: true,
        },
      },
      comments: true,
    },
  });
  console.log('User with posts and comments:', JSON.stringify(user, null, 2));

  //new
  const userCount = await prisma.user.count();
console.log('Total number of users:', userCount);

const averagePosts = await prisma.post.aggregate({
  _avg: {
    id: true,
  },
});
console.log('Average post ID:', averagePosts);

//new2
const paginatedPosts = await prisma.post.findMany({
    skip: 10,
    take: 5,
  });
  console.log('Paginated posts:', paginatedPosts);

  //new3
  const rawUsers = await prisma.$queryRaw`SELECT * FROM User`;
console.log('Users from raw SQL query:', rawUsers);


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
